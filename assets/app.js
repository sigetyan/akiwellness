/* ============================================================
   EDIT THESE BEFORE LAUNCH
   stripeDepositLink: one Stripe Payment Link for the ¥10,000 deposit.
   The chosen treatment is passed as client_reference_id (e.g. oil-90),
   so it shows on every payment in the Stripe dashboard.
   Leave empty and the button falls back to WhatsApp with the
   treatment prefilled.
   ============================================================ */
const CONFIG = {
  stripeDepositLink: "", // e.g. "https://buy.stripe.com/xxxxxxxx"
  deposit: 10000,
  whatsapp: "819074821882",
  line: "https://line.me/ti/p/~aki-a-iri",
  openHour: 12,
  closeHour: 22,
  prices: {
    dry: { 60: 25000, 90: 32000 },
    oil: { 60: 28000, 90: 34000 },
    sports: { 60: 30000, 90: 36000 }
  }
};

const LANG = document.documentElement.lang.startsWith("ja") ? "ja" : "en";

const T = {
  en: {
    names: { dry: "Dry massage", oil: "Oil massage", sports: "Sports massage & physio" },
    choice: (n, d) => `${n}, ${d} min`,
    open: "Taking bookings today, 12pm to 10pm",
    before: "Treatments from 12pm today",
    after: "Now booking from 12pm tomorrow",
    wa: (s, d) => `Hi Aki, I'd like to book a ${d} minute ${s}. Date, time and where I'm staying: `
  },
  ja: {
    names: { dry: "ドライマッサージ", oil: "オイルマッサージ", sports: "スポーツマッサージ＆理学療法" },
    choice: (n, d) => `${n}　${d}分`,
    open: "本日12時から22時まで受付中",
    before: "本日12時から営業。事前予約を受付中です。",
    after: "本日の受付は終了しました。明日12時からのご予約を受付中です。",
    wa: (s, d) => `Akiさん、${s} ${d}分を予約したいです。希望日時と滞在先：`
  }
}[LANG];

const yen = n => "¥" + n.toLocaleString("ja-JP");

/* Live status in Japan time */
(function status() {
  const el = document.querySelector("[data-status]");
  if (!el) return;
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Tokyo" }).format(new Date()));
  const open = h >= CONFIG.openHour && h < CONFIG.closeHour;
  el.dataset.open = String(open);
  el.querySelector("[data-status-text]").textContent = open ? T.open : h < CONFIG.openHour ? T.before : T.after;
})();

/* WhatsApp links */
function waLink(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* Treatment picker */
(function picker() {
  const form = document.querySelector("[data-picker]");
  if (!form) return;
  const out = {
    choice: form.querySelector("[data-choice]"),
    price: form.querySelector("[data-price]"),
    deposit: form.querySelector("[data-deposit]"),
    balance: form.querySelector("[data-balance]"),
    book: form.querySelector("[data-book]"),
    ask: form.querySelector("[data-ask]")
  };

  function update() {
    const style = form.querySelector('input[name="style"]:checked').value;
    const dur = form.querySelector('input[name="duration"]:checked').value;
    const price = CONFIG.prices[style][dur];
    const name = T.names[style];

    out.choice.textContent = T.choice(name, dur);
    out.price.textContent = yen(price);
    out.deposit.textContent = yen(CONFIG.deposit);
    out.balance.textContent = yen(price - CONFIG.deposit);

    const ref = `${style}-${dur}`;
    if (CONFIG.stripeDepositLink) {
      const url = new URL(CONFIG.stripeDepositLink);
      url.searchParams.set("client_reference_id", ref);
      out.book.href = url.toString();
    } else {
      out.book.href = waLink(T.wa(name, dur));
    }
    out.ask.href = LANG === "ja" ? CONFIG.line : waLink(T.wa(name, dur));
    out.book.dataset.treatment = ref;
  }

  form.addEventListener("change", update);
  update();

  /* Picking a style from the price table jumps into the picker */
  document.querySelectorAll("[data-pick]").forEach(a => {
    a.addEventListener("click", () => {
      const [s, d] = a.dataset.pick.split("-");
      form.querySelector(`input[name="style"][value="${s}"]`).checked = true;
      form.querySelector(`input[name="duration"][value="${d}"]`).checked = true;
      update();
    });
  });
})();

/* Generic WhatsApp buttons */
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = waLink(a.dataset.wa);
});
