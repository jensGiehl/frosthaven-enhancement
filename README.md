# Frosthaven – Verbesserungskosten

Deutscher, mobilfreundlicher Rechner für dauerhafte Kartenverbesserungen in Frosthaven. Eine einzelne UTF-8-HTML-Datei enthält Oberfläche, Gestaltung und Berechnung. Kein Build, Backend oder npm-Install nötig. Bootstrap 5.3.8 wird über ein CDN mit Integritätsprüfung geladen; JavaScript und grundlegende Gestaltung sind direkt eingebettet. Webjars werden nicht verwendet, da dieses statische Projekt keine Java-Laufzeit hat.

## Starten

`index.html` direkt im Browser öffnen. Alternativ im Projektverzeichnis `python -m http.server 8080` ausführen und <http://localhost:8080> öffnen. Die Kostenberechnung läuft vollständig im Browser und sendet keine Eingaben an einen Server. Für das Bootstrap-Stylesheet wird eine Internetverbindung benötigt.

## Auf GitHub Pages veröffentlichen

1. Dateien in dein GitHub-Repository übernehmen und auf `main` oder `master` pushen.
2. Im Repository **Settings → Pages → Build and deployment → Source: GitHub Actions** auswählen.
3. Unter **Actions → Deploy GitHub Pages** den Workflow starten oder erneut auf `main` / `master` pushen.
4. Nach erfolgreichem Lauf steht die Seitenadresse im Deployment des Workflows und unter **Settings → Pages**. Üblicherweise lautet sie `https://BENUTZER.github.io/REPOSITORY/`.

Der Workflow prüft die Berechnung und veröffentlicht nur `index.html`. Er kann mit **Run workflow** auch manuell gestartet werden. Bei einem anderen Hauptbranch die Branchliste in `.github/workflows/pages.yml` anpassen. Das Repository muss GitHub Pages unterstützen; Organisationsrichtlinien können die Veröffentlichung einschränken.

## Berechnung

- Alle 28 Verbesserungen der Tabelle auf Seite 77 sowie drei Sonderfälle.
- Grundkosten für ein zusätzliches Wirkungsbereich-Feld: `ceil(200 / vorhandene Felder)`.
- Mehrere Figuren / Felder: Grundkosten ×2, auch bei bedingten Mehrfachzielen. Keine Verdoppelung für Ziele +1, Elemente und Wirkungsbereich-Felder.
- Verloren-Symbol ohne Anhaltend-Symbol auf der Aktion: Grundkosten ÷2.
- Anhaltender Bonus der verbesserten Fertigkeit: Grundkosten ×3, außer bei Beschworenenwerten. Die Aktion und die konkrete Fertigkeit werden getrennt abgefragt.
- Anschließend pro Kartenstufe über 1: +25 Gold, ab Gebäudestufe 3: +15 Gold. Stufe X zählt wie Stufe 1.
- Pro vorhandener Verbesserung derselben Aktion: +75 Gold, ab Gebäudestufe 4: +50 Gold. Verbesserungen auf der anderen Kartenhälfte zählen nicht.
- Ab Gebäudestufe 2 abschließend −10 Gold, mindestens 0 Gold.

Beispiel: Angriff +1, mehrere Ziele, Verloren ohne Anhaltend, Karte Stufe 3, eine vorhandene Verbesserung, Gebäude Stufe 4: `50 × 2 ÷ 2 + 2 × 15 + 50 − 10 = 120 Gold`.

Die Auswahl berechnet den Preis; sie prüft nicht die Zulässigkeit eines Stickers auf einem bestimmten Verbesserungspunkt. Temporäre Verbesserungen aus der Spielvariante sind nicht enthalten. Bei halben Goldbeträgen wird der genaue Rechenwert angezeigt, da Seite 77 keine zusätzliche Rundung für die Halbierung nennt.

## Prüfen

Mit Node.js (im Workflow Version 24):

```sh
node --test tests/calculator.test.cjs
```

Die Tests verwenden dieselbe Berechnungsfunktion wie die HTML-Datei und prüfen insbesondere Modifikatoren-Reihenfolge, Mehrziel-Ausnahmen, Beschworenenwerte, Gebäuderabatte und ungültige Eingaben.

## Quellen

Regelstand geprüft am 03.10.2026:

- [Deutsche Frosthaven-Spielregel, Anhang D, Seite 77](https://www.feuerland-spiele.de/fileadmin/game/Gloomhaven/Frosthaven/CG_F_Rulebook_1stEd_DE_FL_Low.pdf#page=77)
- [Offizielle FAQ, Abschnitt 4.2 – Enhancements](https://cephalofairgames.github.io/frosthaven-faq/#42-enhancements)
- [Offizielle FAQ, Abschnitt 4.1 – Gebäude 44](https://cephalofairgames.github.io/frosthaven-faq/#41-specific-building-questions)
- [Inspiration: Rechner von pikdonker](https://github.com/pikdonker/frosthaven-enhancement-calculator)

Eigenständige Implementierung ohne übernommene Spielgrafiken oder Quellcode des Beispielprojekts. Inoffizielles Fanprojekt; Frosthaven gehört Cephalofair Games.
