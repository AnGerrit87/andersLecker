# Anders lecker! – Ausbauplan 🍓

Stand: 22.11.2026. Dieses Dokument beschreibt geplante Funktionen und noch nicht aktivierte Cloud-Dienste.

## Phase 1 – Gemeinsames Familienkochbuch (Priorität 1)

- [ ] Supabase-Projekt verbinden und eine PostgreSQL-Datenbank einrichten
- [ ] Familie und Mitgliedschaften für zwei oder mehr Accounts (Gerrit und Ronja)
- [ ] Supabase Auth (E-Mail/Passwort oder Magic Link); Zugriff nur für eingeladene Familienmitglieder
- [ ] Supabase Storage in einem **privaten** Bucket für eigene Rezeptfotos; signierte Leselinks und Upload/Update/Löschen mit RLS
- [ ] Alte lokale Rezepte, Bilder, Bewertungen, Favoriten und Einkaufslisten über Backup/Migrationsassistent importieren, ohne Daten zu überschreiben
- [ ] Synchronisierung und Konfliktbehandlung (Updated-at, Änderungsprotokoll)
- [ ] Automatische Backups/Export

### Datenschutz

Das GitHub-Repository und GitHub Pages sind **öffentlich**. Keine privaten Rezeptfotos, Familien-E-Mail-Adressen, Passwörter, Service-Role-Keys oder dauerhaften Authentifizierungstoken hier speichern. Supabase-Datenbank durch RLS absichern und Bucket private halten. Die öffentliche Bring!-Export-Seite darf nur die ausgewählten Rezept- und Zutatenangaben enthalten, unter einem unvorhersehbaren Kurzzeit-Link.

## Phase 2 – Rezepte hinzufügen und benutzen

- [ ] **URL-Import:** Chefkoch, einfachkochen.de und weitere Seiten über Schema.org/JSON-LD (mit Vorschau und manueller Prüfung)
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
