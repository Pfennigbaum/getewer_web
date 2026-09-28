# getewer.de – Landingpage

Statische One-Page-Website für **Ewer – Die KI-Werkstatt für Gemeinden**. Kein Build-Schritt, kein Framework: HTML, CSS und etwas JavaScript.

```
index.html          Landingpage
impressum.html      Impressum (Platzhalter ausfüllen!)
datenschutz.html    Datenschutzerklärung (Entwurf, prüfen!)
assets/css          Styles
assets/js/main.js   Konfiguration, Kontaktformular, Terminal-Animation
assets/fonts        Lokal gehostete Schriften (DSGVO: kein Google-Fonts-Abruf)
assets/img          Bilder
CNAME               Custom Domain für GitHub Pages
```

## Lokal ansehen

```bash
python -m http.server 8000
```

Dann <http://localhost:8000> öffnen.

## Veröffentlichen mit GitHub Pages

1. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, Ordner `/ (root)`.
2. **Custom domain** eintragen (steht auch in `CNAME`) und speichern.
3. DNS beim Domain-Anbieter setzen (siehe unten), warten bis GitHub „DNS check successful“ meldet.
4. **Enforce HTTPS** aktivieren, sobald das Zertifikat da ist (kann bis zu 1 Stunde dauern).

> Private Repositories können GitHub Pages nur mit einem bezahlten Plan (GitHub Pro / Team) nutzen. Ohne Pro: Repository auf *public* stellen.

### DNS-Einträge

Für `www.<domain>` als Hauptadresse:

| Typ   | Name / Host | Wert                     |
|-------|-------------|--------------------------|
| CNAME | `www`       | `pfennigbaum.github.io.` |
| A     | `@`         | `185.199.108.153`        |
| A     | `@`         | `185.199.109.153`        |
| A     | `@`         | `185.199.110.153`        |
| A     | `@`         | `185.199.111.153`        |
| AAAA  | `@`         | `2606:50c0:8000::153`    |
| AAAA  | `@`         | `2606:50c0:8001::153`    |
| AAAA  | `@`         | `2606:50c0:8002::153`    |
| AAAA  | `@`         | `2606:50c0:8003::153`    |

Die `@`-Einträge sorgen dafür, dass auch die Adresse ohne `www` funktioniert und automatisch weiterleitet. Vorhandene A-/AAAA-/CNAME-Einträge für `@` und `www` vorher entfernen.

### Umzug von der Testdomain auf getewer.de

Aktuell läuft die Seite testweise unter `www.wessenstedt.de`. Für den Livegang:

1. `CNAME` auf `www.getewer.de` (oder `getewer.de`) ändern und pushen.
2. In **Settings → Pages** die Custom Domain entsprechend ändern.
3. Die DNS-Einträge oben bei getewer.de setzen.

Tipp: Unter **GitHub → Settings (Account) → Pages → Verified domains** die Domain verifizieren. Dann kann niemand anderes sie für eine eigene Pages-Seite verwenden.

## Kontaktformular

Einstellungen oben in `assets/js/main.js` (`CONFIG`):

- **Standard:** Das Formular öffnet das Mailprogramm des Besuchers mit einer vorausgefüllten Mail an `moin@getewer.de`.
- **Direkter Versand (optional):** Kostenlosen Account bei [Formspree](https://formspree.io) oder [Web3Forms](https://web3forms.com) anlegen und `formEndpoint` (bei Web3Forms zusätzlich `accessKey`) eintragen. Den Anbieter dann in der Datenschutzerklärung ergänzen.

## Terminal-Animation

Die Beispiele im Abschnitt „So entsteht eine Lösung“ stehen als `SCENARIOS` in `assets/js/main.js` und lassen sich dort einfach ändern oder ergänzen (für ein neues Beispiel zusätzlich einen Tab-Button in `index.html` anlegen).

## Offene Punkte

- [ ] Impressum und Datenschutz ausfüllen
- [ ] Domain auf getewer.de umstellen
