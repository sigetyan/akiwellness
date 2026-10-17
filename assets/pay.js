/* ============================================================
   PAYMENT LINKS FOR /pay/
   Paste one Stripe Payment Link per option (full price, JPY).
   In Stripe, on each link: turn on "Create invoice PDF",
   collect name + phone, add a custom field for date and
   accommodation, allow quantity 1 to 4, and set the
   confirmation page to redirect to https://akiwellness.jp/paid/
   An empty link shows a "message Aki" note instead of a button.
   ============================================================ */
const PAY = {
  links: {
    "sports-60": "",
    "sports-90": "",
    "oil-60": "",
    "oil-90": "",
    "dry-60": "",
    "dry-90": ""
  },
  prices: {
    "sports-60": 30000, "sports-90": 35000,
    "oil-60": 28000, "oil-90": 33000,
    "dry-60": 25000, "dry-90": 30000
  },
  names: { sports: "Sports massage & physio", oil: "Oil massage", dry: "Dry massage" }
};

(function () {
  const form = document.querySelector("[data-pay]");
  if (!form) return;
  const choice = form.querySelector("[data-choice]");
  const price = form.querySelector("[data-price]");
  const btn = form.querySelector("[data-pay-btn]");
  const note = form.querySelector("[data-pay-note]");
  const yen = n => "¥" + n.toLocaleString("ja-JP");

  /* ?t=oil-90 preselects an option, so Aki can send a direct link */
  const pre = new URLSearchParams(location.search).get("t");
  if (pre && PAY.prices[pre]) {
    const [s, d] = pre.split("-");
    const sEl = form.querySelector(`input[name="style"][value="${s}"]`);
    const dEl = form.querySelector(`input[name="duration"][value="${d}"]`);
    if (sEl && dEl) { sEl.checked = true; dEl.checked = true; }
  }

  function update() {
    const s = form.querySelector('input[name="style"]:checked').value;
    const d = form.querySelector('input[name="duration"]:checked').value;
    const key = `${s}-${d}`;
    const amount = PAY.prices[key];
    choice.textContent = `${PAY.names[s]}, ${d} min`;
    price.textContent = yen(amount);
    const link = PAY.links[key];
    if (link) {
      const url = new URL(link);
      url.searchParams.set("client_reference_id", key);
      btn.href = url.toString();
      btn.textContent = `Pay ${yen(amount)} by card`;
      btn.hidden = false;
      note.hidden = true;
    } else {
      btn.hidden = true;
      note.hidden = false;
    }
  }

  form.addEventListener("change", update);
  update();
})();
