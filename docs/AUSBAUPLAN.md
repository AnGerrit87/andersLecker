# Anders lecker! – Ausbauplan 🍓

Stand: 22.11.2026. Dieses Dokument beschreibt geplante Funktionen und noch nicht aktivierte Cloud-Dienste.

## Phase 1 – Gemeinsames Familienkochbuch (Priorität 1)

- [x] Supabase-Projekt `anders-lecker` in Frankfurt (`eu-central-1`) erstellt und PostgreSQL-Datenbank vorbereitet
- [x] Tabellen und RLS für Familienmitgliedschaften, Rezepte, Sterne, Einkaufslisten und Wochenplanung angelegt
- [ ] Sichere Familien-Einladung und Mitgliedschaft für zwei oder mehr Accounts ermöglichen
- [ ] Supabase Auth (E-Mail/Passwort oder Magic Link); Zugriff nur für eingeladene Familienmitglieder
- [x] Privater Storage-Bucket `recipe-photos` mit RLS für Familienmitglieder eingerichtet (max. 5 MB, JPEG/PNG/WebP)
- [ ] Foto-Upload und signierte Leselinks in der Web-App mit Familienanmeldung verbinden
- [ ] Alte lokale Rezepte, Bilder, Bewertungen, Favoriten und Einkaufslisten über Backup/Migrationsassistent importieren, ohne Daten zu überschreiben
- [ ] Synchronisierung und Konfliktbehandlung (Updated-at, Änderungsprotokoll)
- [ ] Automatische Backups/Export

### Datenschutz

Das GitHub-Repository und GitHub Pages sind **öffentlich**. Keine privaten Rezeptfotos, Familien-E-Mail-Adressen, Passwörter, Service-Role-Keys oder dauerhaften Authentifizierungstoken hier speichern. Supabase-Datenbank durch RLS absichern und Bucket private halten. Die öffentliche Bring!-Export-Seite darf nur die ausgewählten Rezept- und Zutatenangaben enthalten, unter einem unvorhersehbaren Kurzzeit-Link.

## Phase 2 – Rezepte hinzufügen und benutzen

- [x] **Breiter URL-Import:** 90+ bekannte Koch- und Backdomains; Schema.org/JSON-LD, WordPress-Rezeptkarten und HTML-Fallback; Zubereitung und Zutaten prüfen und selektiv übernehmen
- [ ] **URL-Import weiter verbessern:** weitere Seiten bei Bedarf ergänzen, standortspezifische Parser für Webseiten ohne brauchbare Daten, automatische Regressionstests mit echten Quellen
- [ ] **Foto-/KI-Import:** Zutaten, Mengen, Portionen und Schritte aus Screenshots/Kochbuchfotos erkennen; Ergebnis kontrollierbar
- [ ] **Kochmodus:** großer Schritt-für-Schritt-Text, abhakbare Zutaten, mehrere Küchentimer, Display wach halten sofern Browser erlaubt
- [ ] **Notizen:** „Mehr würzen“, Kinderfeedback, eigene Änderungen und Varianten
- [ ] **Filter:** Bewertung, Kategorie, Kochzeit, vegetarisch, Zutaten, Favorit, zuletzt gekocht
- [ ] **Zufallsrezept:** „Was kochen wir heute?“
- [ ] **Sammlungen:** Weihnachten, Feierabend, Kuchen, Lieblingsessen der Kinder

## Phase 3 – Planen und einkaufen

- [ ] **Wochenplaner:** Gerichte per Tag und Mahlzeit, optional Familiengröße und Resteverwertung
- [ ] **Intelligente Einkaufsliste:** Zutaten mehrerer Gerichte normalisieren und nach Einheit addieren (z.B. 200 + 300 g), Mengen nicht quer über inkompatible Einheiten zusammenfassen
- [x] **Mengen auswählen:** Portions-/Stückzahl direkt eintippen, Zutaten sofort umrechnen
- [x] **Bring! Übergang:** Zutaten in der umgerechneten Menge kopieren und Originalrezept in Bring! importieren, sofern Bring! die Quellseite unterstützt
- [ ] **Bring! Wunschmengen:** Temporäre, öffentlich abrufbare Rezeptseite als Schema.org/Recipe mit exakt umgerechneten Zutaten erzeugen. Bring! Deeplink erhält **nur die URL**. Keine Family-Login-Daten oder Bilder preisgeben. Kurzzeit-Link nach Ablauf löschen.
- [ ] „Alle Zutaten des Wochenplans zu Bring!“ über einen temporären Rezept-/Listenexport oder eine offiziell unterstützte Schnittstelle prüfen

### Bring! technische Notiz

Bring! importiert von einer öffentlich erreichbaren Rezeptseite, die von ihren Servern **ohne Anmeldung** mit Schema.org-Recipe/JSON-LD gelesen wird. Die statische GitHub-Pages-App kann für lokal gespeicherte Rezeptänderungen und beliebige Wunschportionen keine dynamische crawlerlesbare Seite bereitstellen. Nach dem Supabase-Setup ist ein Edge-Function-Service für kurzlebige Exporte eine passende Option. Änderungen in der Bring!-Liste sind aktuell **keine** bidirektionale Synchronisierung.

## Bestehende Funktionen

- [x] 37 vollständige Familienrezepte, A–Z-Sortierung, Umbenennen, Bewertungen, eigene Fotos
- [x] Portionsrechner mit direkter Zahleneingabe
- [x] Favoriten, Kategorien, Suche, lokale Einkaufsliste, JSON-Backups
- [x] Static App auf GitHub Pages

## Reihenfolge

1. Cloud und private Fotos sicher einrichten, bevor viel mehr Fotos auf einzelnen Geräten gespeichert werden.
2. Lokale Daten in die Cloud migrieren; beide Familien-Accounts testen.
3. Bring!-Backend mit **genauer** Wunschmenge integrieren.
4. Wochenplaner, Einkaufsliste und die restlichen Komfortfunktionen nacheinander einbauen.

## Supabase-Projekt – angelegt am 22.11.2026

- Projekt: [anders-lecker](https://supabase.com/dashboard/project/sisabhrlstgprgxjdnns)
- Region: Frankfurt (`eu-central-1`)
- Kostenangebot zum Erstellungszeitpunkt: 0 USD/Monat (Free; Nutzungslimits gelten)
- Öffentliche Projekt-URL (keine Zugangsdaten): `https://sisabhrlstgprgxjdnns.supabase.co`
- Tabellen: `families`, `family_members`, `recipes`, `recipe_ratings`, `shopping_items`, `meal_plans`
- Private Storage: `recipe-photos` (JPEG/PNG/WebP, 5 MB je Datei), Familien-Verzeichnis unter `<family_id>/`
- Alle sechs Tabellen haben RLS, Familienzugriff über Mitgliedschaft; SQL-Test auf anonyme Abfragen ergab keine lesbaren Familien.
- Sicherheits-Advisors zum Zeitpunkt der Erstellung: keine Meldungen.
- **Wichtig:** Die Web-App nutzt derzeit weiter den lokalen Browser-Speicher. Die Cloud-Funktionen sind auf Datenbank-Seite vorbereitet, aber Benutzeranmeldung, Cloud-Migration, synchronisierte Bildverwaltung und Familien-Einladung sind noch nicht mit dem Frontend verbunden.
- Ein Familienkonto ist noch nicht angelegt, weil dafür zuerst eine authentifizierte Anmeldung nötig ist.
- Keine privaten Zugangsdaten ins Repository committen. Nur publishable Keys dürfen später für den Browser eingesetzt werden.

- [x] Waldis Pizza (Pizzateig): Quellenfreigabe, geprüfte Kurzfassung als Fallback, 10 Schritte und skalierbare Hefemengen-Spanne (22.11.2026)
