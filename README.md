# 🍓 Anders lecker! ♡

**Das digitale Familienkochbuch der Familie Anders.**

Eine gemütliche, pastellfarbene Koch-App, die die Lieblingsrezepte aus verschiedenen Quellen an einem Ort sammelt.

## ✅ Stand des Prototyps

- 36 importierte Rezeptkarten mit Originalquellen + unser Subway-Style-Cookie-Familienrezept
- Bei allen 37 Rezepten: Zutaten, kurze selbstformulierte Anleitung und Portionsrechner
- Original-Links als Quellen für importierte Rezepte
- Rezeptsuche, Kategorien und Favoriten
- Eigene Rezepte manuell oder aus eingefügtem Rezepttext erstellen
- Rezeptfotos mit OCR/Texterkennung auslesen (Erkennung bitte prüfen)
- Einkaufsliste und JSON-Backup
- Responsive Oberfläche für Smartphone und Desktop
- Installierbare Web-App (PWA)

## 💻 Lokal starten

`index.html` im Browser öffnen. Für Service Worker und PWA-Installation sollte die Seite über einen lokalen Webserver oder HTTPS bereitgestellt werden.

Beispiel mit Python:

```bash
python -m http.server 8000
```

Anschließend im Browser `http://localhost:8000` öffnen.

## 🌐 GitHub Pages

Bei einem **öffentlichen** Repository kann die statische App über **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)** veröffentlicht werden.

Die Adresse ist anschließend voraussichtlich:
`https://angerrit87.github.io/andersLecker/`

Die Seite wird dadurch öffentlich sichtbar. GitHub Pages ist **keine private Familien-Datenbank** und bietet für diese App noch keinen Anmeldeschutz.

## 💾 Daten & Grenzen

- Persönliche Änderungen werden **lokal pro Browser** im `localStorage` gespeichert; noch keine Synchronisierung zwischen Geräten.
- Vor einem Browser-Reset ein **JSON-Backup** exportieren.
- `data/rezepte.json` dokumentiert den importierten Ausgangsbestand; aktuell lädt die App die Beispielrezepte noch direkt aus `index.html`.
- Die Rezepterkennung benötigt ggf. Internet und muss von Hand geprüft werden. Neue Chefkoch-Links werden noch nicht vollautomatisch als Zutatenlisten ausgelesen; die 36 bestehenden importierten Rezepte wurden manuell abgeglichen.
- Die Original-Rezeptseiten bleiben mit ihren Links als Quelle hinterlegt.

## 🛠️ Nächste Ausbauschritte

1. Gemeinsamer Login für die Familie
2. Zentrale Datenbank mit geräteübergreifender Synchronisation
3. Rezeptimport per URL und Foto mit kontrollierter Übernahme
4. Bearbeitbare Rezeptfotos und bessere Kategorisierung
5. Wochenplanung und smarte gemeinsame Einkaufsliste

Erstellt als erster gemeinsamer App-Prototyp – mit Liebe zum Kochen. 💗

## 🖼️ Eigene Fotos, ⭐ Bewertungen und Rezeptgrößen

- Jedes Rezept ist in der Sammlung alphabetisch nach seinem Titel sortiert (A–Z, deutsche Sortierung).
- Im geöffneten Rezept: **Umbenennen** ändert nur den Titel und erhält alle Zutaten, Favoriten und Notizen.
- Ein eigenes Gerichtsfoto kann direkt am Rezept hinzugefügt, ausgetauscht oder gelöscht werden.
- Rezepte haben **1–5 Sterne** als persönliche Bewertung; die Herz-Favoriten bleiben separat.
- Die gewünschte Anzahl an Cookies, Klößen oder Portionen wird direkt als Zahl eingetippt, z. B. **80 → 40 Cookies**.
- Fotos, Sterne, Umbenennungen und andere Änderungen werden **nur in diesem Browser** gespeichert. Bitte regelmäßige JSON-Backups anlegen. Eine zentrale Familien-Datenbank und ein Fotospeicher stehen noch aus.
- Bilder werden für die lokale Speicherung verkleinert. Für eine große Bildsammlung empfiehlt sich später gemeinsamer Cloud-Speicher.

## 🛒 Bring! Einkaufsliste – Zwischenstand

- Die Schaltfläche **Zutaten kopieren** berücksichtigt die im Rezept eingetragene Wunschmenge (z. B. 40 statt 80 Cookies).
- Bei importierten Rezepten mit Quellenlink führt **Bring! (Originalmengen)** zur Bring!-Importfunktion für die Originalseite. Die Originalseite muss von Bring! unterstützt werden.
- **Achtung:** Ein Import über den Original-Link übernimmt NICHT die geänderte Portionsmenge und auch keine nachträglichen Änderungen in Anders lecker! Auf Wunschmenge umgerechnete Zutaten lassen sich bereits kopieren.
- Die direkte Übernahme beliebig skalierter Zutaten in Bring! benötigt eine öffentlich erreichbare, kurzfristige schema.org-Rezeptseite, die von einem Backend erzeugt wird. Die Familien-Datenbank bleibt dabei geschützt.
- GitHub Pages allein kann eine solche temporäre Seite aus lokal im Browser gespeicherten Rezepten nicht für Bring! bereitstellen. Bring!-Zugangsdaten oder inoffizielle Listen-Schreib-APIs sind für den vorgesehenen Rezeptimport nicht notwendig.

## Bring! Export für alle Rezeptkarten (November 2026)

- Im geöffneten Rezept die gewünschte Anzahl an Portionen/Stücken eingeben, dann **Zu Bring! übertragen** auswählen.
- Das funktioniert unabhängig von einer Chefkoch-Quelle – auch für selbst erstellte Cookies und andere eigene Rezepte.
- Die App übergibt nur Rezepttitel, aktuelle Menge und die umgerechneten Zutaten an die öffentliche, stateless Supabase Edge Function `bring-recipe`. Diese liefert serverseitig ein HTML-Dokument mit `schema.org/Recipe` als JSON-LD, damit Bring! die Mengen auslesen kann.
- Auf der Bring!-Seite die erkannten Zutaten kontrollieren, bevor sie der Einkaufsliste hinzugefügt werden. Die endgültige Übernahme hängt vom Bring!-Parser und vom App-/Browser-Deep-Link ab.
- Diese Export-Rezeptvorschau ist **über ihre URL öffentlich erreichbar**, weil Bring!-Server sie ohne Anmeldung lesen müssen. Keine Fotos, Kontodaten, private Notizen oder Geheimnisse mitsenden.
- Es werden **keine** Cloud-Zugangsdaten benötigt und keine privaten Familien-Datenbanktabellen gelesen oder verändert. Der Export-Link enthält die Daten selbst (Base64URL-kodiert, nicht verschlüsselt) und wird im Backend nicht persistent gespeichert.
- Fallback bei Import-Problemen: **Zutaten kopieren**.

## 📖 Zubereitung von der Originalseite importieren

- Im Menü **Rezept hinzufügen → Text & Link** nur den Link einfügen und auf **Rezept aus Link lesen / Text prüfen** tippen. Die App ruft über die Supabase Edge Function `recipe-import` die strukturierten `schema.org/Recipe`-Felder `recipeInstructions` und `recipeIngredient` ab.
- Unterstützte Domains (best effort): **chefkoch.de**, **einfachkochen.de** und **blueberryvegan.com**. Manche Seiten blockieren das automatische Auslesen oder bieten keine strukturierten Schritte; dann erfolgt eine verständliche Fehlermeldung. **Nur Link merken** ist der Fallback.
- Bei vorhandenen Rezepten mit Quellen-Link erscheint **Zubereitung von Originalseite einlesen**. Die App zeigt die ausgelesenen Schritte in einer Vorschau.
- Bei bestehenden Rezepten werden standardmäßig **nur die Zubereitungsschritte** ersetzt. Zutaten können optional neu übernommen werden. Der Titel, eigene Fotos, Sterne und Favoriten werden nicht automatisch überschrieben.
- Ein übernommener Entwurf muss im Bearbeitungsformular **explizit gespeichert** werden.
- Es werden **keine** Fotos der Quellseiten oder privaten Daten an den Lesedienst übertragen. Der Lesedienst lädt lediglich den eingegebenen HTTPS-Rezeptlink und nutzt keine private Supabase-Datenbank.
- Die Funktion läuft derzeit ohne Familien-Login und speichert die importierten Texte weiterhin nur lokal im verwendeten Browser.

## 🍕 Waldis Pizza: Original italienischer Pizzateig

- Der Import akzeptiert jetzt `waldispizza.de` und `www.waldispizza.de` über die sichere Domain-Freigabeliste.
- Die spezifische Seite `https://www.waldispizza.de/blog/italienischer-pizzateig-rezept` besitzt einen anhand der Originalseite geprüften Fallback für sechs Pizzen und zehn Zubereitungsschritte. Der Fallback ist eine **Kurzfassung in eigenen Worten**, kein wortgetreuer Komplettabdruck.
- Wenn der Abruf blockiert oder kein passendes Rezept-JSON-LD vorliegt, bietet der Import weiterhin diese geprüfte Kurzfassung an. Eine entsprechende Meldung steht in der Importvorschau.
- Zutatenbereiche wie `1–2 g frische Hefe` werden jetzt als `amountRange` gespeichert und skaliert (z. B. auf drei Pizzen: `0,5–1 g`).
- Der Import wird wie gewohnt **erst nach Bestätigung** im Browser gespeichert; eigene Fotos und Bewertungen bleiben erhalten.
- Die Edge-Function-Quelle liegt zur Nachvollziehbarkeit unter `supabase/functions/recipe-import/index.ts` und ist im Supabase-Projekt bereitgestellt. Die tatsächlich live deployte Funktionsversion ist maßgeblich.

## 🌍 Breiter Rezeptimport (November 2026)

- Der Import kennt **über 90 bekannte Koch- und Backdomains**, darunter Chefkoch, LECKER, Essen & Trinken, Kitchen Stories, Kochbar, EAT SMARTER, Gute Küche, REWE, EDEKA, einfache Rezeptseiten und viele Foodblogs. Auch internationale Seiten sind abgedeckt.
- Die aktuelle, verbindliche Liste der erlaubten Domains befindet sich in `supabase/functions/recipe-import/index.ts` (`allowedDomains`). Nur diese Domains und bestimmte gebräuchliche Subdomains dürfen vom öffentlichen Importdienst abgerufen werden. Das verhindert einen frei missbrauchbaren Web-Proxy und schränkt SSRF-Angriffsflächen ein.
- Der Parser versucht nacheinander: **Schema.org Recipe/JSON-LD** (inklusive verschachtelter HowTo-Schritte und `@graph`), **WordPress Recipe Maker / Tasty Recipes / HTML-Rezeptkarten** sowie **sichtbare Zutaten-/Zubereitungsabschnitte**.
- Rezepte werden als Vorschau mit Zutaten, Schritten und, falls ermittelbar, Portionen/Zeit dargestellt. Nichts wird ohne ausdrückliches Speichern in der App übernommen.
- Falls die Seite automatisierte Zugriffe mit Login, Paywall, Captcha, Cloudflare oder `HTTP 403/429` blockiert, erscheint eine Meldung. **Alternative:** Rezepttext einfügen, Foto scannen oder nur den Link speichern.
- **Keine Garantie für jede einzelne Webseite/Unterseite:** Die verschiedenen Portale verändern ihren HTML-Aufbau. Die Unterstützung ist best effort und an die Verfügbarkeit der öffentlich sichtbaren Rezeptdaten gebunden.
- Der Importdienst benötigt keine Anmeldung und erhält nur den angegebenen Rezeptlink. Er liest keine privaten Rezeptfotos oder Datenbanktabellen aus.
- Technische Prüfung: Parser mit synthetischen Beispielen für JSON-LD `@graph`, `HowToSection`, HTML-escaped JSON, WordPress-Rezeptkarten und Abschnittsüberschriften getestet. Live-Imports von jeder der über 90 Websites sind noch nicht vollständig verifiziert.
