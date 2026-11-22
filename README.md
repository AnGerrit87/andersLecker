# 🍓 Anders lecker! ♡

**Das digitale Familienkochbuch der Familie Anders.**

Eine gemütliche, pastellfarbene Koch-App, die die Lieblingsrezepte aus verschiedenen Quellen an einem Ort sammelt.

## ✅ Stand des Prototyps

- 36 importierte Rezeptkarten mit Originalquellen + unser Subway-Style-Cookie-Familienrezept
- Bei 19 Rezepten: Zutaten, Kurz-Anleitung und Portionsrechner
- 18 weitere Rezepte: Rezeptkarte mit Link zur Originalquelle
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
- Die Rezepterkennung benötigt ggf. Internet und muss von Hand geprüft werden. Chefkoch-Links werden noch nicht vollautomatisch als Zutatenlisten ausgelesen.
- Die Original-Rezeptseiten bleiben mit ihren Links als Quelle hinterlegt.

## 🛠️ Nächste Ausbauschritte

1. Gemeinsamer Login für die Familie
2. Zentrale Datenbank mit geräteübergreifender Synchronisation
3. Rezeptimport per URL und Foto mit kontrollierter Übernahme
4. Bearbeitbare Rezeptfotos und bessere Kategorisierung
5. Wochenplanung und smarte gemeinsame Einkaufsliste

Erstellt als erster gemeinsamer App-Prototyp – mit Liebe zum Kochen. 💗
