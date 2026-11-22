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
