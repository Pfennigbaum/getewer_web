/* ───────────── Konfiguration ─────────────
 * email:        Empfänger-Adresse (wird für mailto und den E-Mail-Link genutzt).
 * formEndpoint: Optional. Mit einem Form-Dienst (z. B. Formspree oder Web3Forms)
 *               wird die Nachricht direkt verschickt, ohne dass sich das Mailprogramm öffnet.
 *               Formspree:  "https://formspree.io/f/<id>"
 *               Web3Forms:  "https://api.web3forms.com/submit" + accessKey
 *               Leer lassen → Fallback: Mailprogramm öffnet sich mit vorausgefüllter Mail.
 */
const CONFIG = {
  email: ["moin", "getewer.de"].join("@"),
  formEndpoint: "https://api.web3forms.com/submit",
  accessKey: "007dabb9-a28b-4067-976f-a27c00cca87b",
};

document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Jahr im Footer */
document.getElementById("year").textContent = new Date().getFullYear();

/* E-Mail-Links (Adresse erst per JS einsetzen → etwas weniger Spam) */
document.querySelectorAll("[data-email]").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
  a.textContent = CONFIG.email;
});

/* Nav-Rahmen beim Scrollen */
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Reveal-on-scroll */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ───────────── Terminal ─────────────
 * Schritt-Typen:
 *   user  – Eingabe, wird getippt
 *   work  – Spinner mit Text, danach ✓ + Ergebnis
 *   ok    – ✓ + Text
 *   warn  – ! + Text
 *   ask   – Rückfrage, Antwort wird getippt
 *   live  – ● Live unter …
 *   note  – gedimmte Zusatzzeile
 */
const SCENARIOS = [
  [
    ["user", "Baue eine Anmeldung für die Kinderfreizeit"],
    ["work", "Formular wird angelegt", "Formular mit Alter, Allergien und Notfallkontakt"],
    ["work", "Warteliste wird eingerichtet", "Warteliste ab 40 Kindern"],
    ["work", "E-Mail wird formuliert", "Bestätigungsmail an die Eltern"],
    ["ask", "Vorschau ansehen und freigeben?", "ja"],
    ["live", "gemeinde.de/kinderfreizeit"],
    ["note", "Läuft auf eurem Server. Backups sind eingerichtet."],
  ],
  [
    ["user", "Ordne die neuen Belege aus dem Postfach zu"],
    ["work", "Postfach wird durchsucht", "23 neue Belege gefunden"],
    ["work", "Belege werden gelesen", "Betrag, Datum und Kostenstelle erkannt"],
    ["warn", "2 Belege unklar – zur Prüfung markiert"],
    ["ask", "21 Buchungen an die Buchhaltung übergeben?", "ja"],
    ["ok", "21 Buchungen übertragen"],
    ["note", "Läuft ab jetzt jeden Montag automatisch."],
  ],
  [
    ["user", "Erstelle eine Seite für unser Sommerfest"],
    ["work", "Seite wird gestaltet", "Programm, Anfahrt und Anmeldung"],
    ["work", "Bilder werden eingebunden", "Fotos aus dem Gemeinde-Ordner eingebunden"],
    ["work", "Seite wird geprüft", "Fürs Handy optimiert und barrierearm"],
    ["ask", "Veröffentlichen?", "ja"],
    ["live", "gemeinde.de/sommerfest"],
    ["note", "Auf eurem Server – mit sicherer Verbindung und Backup."],
  ],
];

const term = document.getElementById("terminal");
const tabs = [...document.querySelectorAll(".tab[data-scenario]")];

if (term) {
  const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
  const el = (cls, text = "") => {
    const s = document.createElement("span");
    if (cls) s.className = cls;
    s.textContent = text;
    return s;
  };

  let run = 0; // erhöht sich bei jedem Neustart → alte Durchläufe brechen ab
  let autoTimer = null;
  let current = 0;

  const setTab = (i) =>
    tabs.forEach((t, j) => {
      t.classList.toggle("is-active", i === j);
      t.setAttribute("aria-selected", String(i === j));
    });

  const play = async (i) => {
    const id = ++run;
    clearTimeout(autoTimer);
    current = i;
    setTab(i);

    const sleep = (ms) =>
      new Promise((resolve, reject) =>
        setTimeout(() => (id === run ? resolve() : reject("cancel")), ms)
      );
    const caret = el("caret");
    const newline = () => caret.before("\n");
    const type = async (target, text, speed = 32) => {
      for (const ch of text) {
        target.textContent += ch;
        await sleep(speed + Math.random() * 30);
      }
    };

    try {
      term.textContent = "";
      term.append(el("t-dim", "~/gemeinde $"), " ", caret);
      const cmd = el();
      caret.before(cmd);
      await sleep(400);
      await type(cmd, "ewer", 80);
      await sleep(350);
      newline();
      caret.before(el("t-brand", "ewer"), " ", el("t-dim", "· Was steht heute an?"));
      await sleep(500);

      for (const [kind, a, b] of SCENARIOS[i]) {
        newline();
        if (kind === "user") {
          const u = el("t-user", "› ");
          caret.before(u);
          await sleep(300);
          await type(u, a);
          await sleep(600);
        } else if (kind === "work") {
          const icon = el("t-spin", SPIN[0]);
          const label = el("t-dim", ` ${a} …`);
          caret.before(icon, label);
          for (let f = 1; f < 12; f++) {
            await sleep(80);
            icon.textContent = SPIN[f % SPIN.length];
          }
          icon.className = "t-ok";
          icon.textContent = "✓";
          label.className = "";
          label.textContent = ` ${b}`;
          await sleep(250);
        } else if (kind === "ok" || kind === "warn") {
          caret.before(el(`t-${kind}`, kind === "ok" ? "✓" : "!"), ` ${a}`);
          await sleep(500);
        } else if (kind === "ask") {
          caret.before(el("t-ask", `? ${a}`), " ");
          await sleep(900);
          const ans = el("t-user");
          caret.before(ans);
          await type(ans, b, 90);
          await sleep(500);
        } else if (kind === "live") {
          caret.before(el("t-live", "● Live"), ` unter ${a}`);
          await sleep(450);
        } else if (kind === "note") {
          caret.before(el("t-dim", `  ${a}`));
        }
      }

      // Nächstes Beispiel automatisch
      autoTimer = setTimeout(() => {
        if (id === run) play((i + 1) % SCENARIOS.length);
      }, 5000);
    } catch (e) {
      if (e !== "cancel") throw e;
    }
  };

  tabs.forEach((t) => t.addEventListener("click", () => play(Number(t.dataset.scenario))));

  if (!("IntersectionObserver" in window)) {
    play(0);
  } else {
    const tio = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          tio.disconnect();
          play(current);
        }
      },
      { threshold: 0.4 }
    );
    tio.observe(term);
  }
}

/* ───────────── Kontaktformular ───────────── */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

const setStatus = (msg, isError = false) => {
  status.textContent = msg;
  status.classList.toggle("is-error", isError);
};

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  setStatus("");

  const data = new FormData(form);
  if (data.get("website")) return; // Honeypot ausgefüllt → Bot

  // Validierung
  let firstInvalid = null;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.setAttribute("aria-invalid", String(!ok));
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    setStatus("Bitte füllt Name, E-Mail und Nachricht aus.", true);
    firstInvalid.focus();
    return;
  }

  const themen = data.getAll("themen");
  const name = data.get("name").trim();
  const gemeinde = data.get("gemeinde").trim();
  const email = data.get("email").trim();
  const nachricht = data.get("nachricht").trim();
  const subject = `Anfrage Erstgespräch${gemeinde ? ` – ${gemeinde}` : ""}`;

  // Variante A: Form-Dienst (direkter Versand)
  if (CONFIG.formEndpoint) {
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const payload = {
        subject,
        name,
        gemeinde,
        email,
        themen: themen.join(", "),
        nachricht,
        ...(CONFIG.accessKey && { access_key: CONFIG.accessKey }),
      };
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      setStatus("Danke! Eure Nachricht ist angekommen. Wir melden uns in Kürze.");
    } catch {
      setStatus(`Das hat leider nicht geklappt. Schreibt uns gern direkt an ${CONFIG.email}.`, true);
    } finally {
      btn.disabled = false;
    }
    return;
  }

  // Variante B: Mailprogramm mit vorausgefüllter Nachricht öffnen
  const details = [
    `Name: ${name}`,
    gemeinde && `Gemeinde: ${gemeinde}`,
    `E-Mail: ${email}`,
    themen.length && `Themen: ${themen.join(", ")}`,
  ].filter(Boolean);
  const body = `${details.join("\n")}\n\n${nachricht}`;

  window.location.href =
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setStatus("Euer Mailprogramm öffnet sich – dort einfach auf „Senden“ klicken.");
});
