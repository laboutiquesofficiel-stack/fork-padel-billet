"use strict";
(() => {
  const ENDPOINT = "https://jkauoxpsmtaowvlxnpgr.supabase.co/functions/v1/retrouver-billet";
  const form = document.getElementById("form");
  const input = document.getElementById("email");
  const button = document.getElementById("submit");
  const msg = document.getElementById("msg");
  const show = (text, ok) => {
    msg.textContent = text;
    msg.classList.toggle("ok", ok);
    msg.hidden = false;
  };

  // Pré-remplissage possible via ?email=… (lien depuis un e-mail)
  const pre = new URLSearchParams(location.search).get("email");
  if (pre) input.value = pre;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return show("Indique une adresse e-mail valide.", false);
    button.disabled = true;
    button.textContent = "Envoi…";
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) show(data.message || "C'est envoyé ! Regarde tes e-mails (et tes spams).", true);
      else show(data.message || "Ça n'a pas marché, réessaie dans un instant.", false);
    } catch {
      show("Connexion impossible. Vérifie ton réseau et réessaie.", false);
    } finally {
      button.disabled = false;
      button.textContent = "Recevoir mon billet";
    }
  });
})();
