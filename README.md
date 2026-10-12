# Premierzy Polski

Statyczna, responsywna strona: https://kotymek.github.io/premierzy/

Poziomy wykres dni urzędowania od 7 listopada 1918, filtry epok, wyszukiwanie, sortowanie, sumy na osobę i eksport CSV. Rządy na uchodźstwie do pełnego urzędowania Tomasza Arciszewskiego (2 lipca 1947).

## Uruchomienie

Otwórz `index.html` lub uruchom `python -m http.server 8765`. Bez instalacji zależności i bez procesu budowania. Google Fonts są opcjonalne; działają lokalne fonty zastępcze.

## Dane

`data.js` zawiera przedziały dat i afiliacje. Główne źródło: [Premierzy Polski](https://pl.wikipedia.org/wiki/Premierzy_Polski), odczyt 2026-10-12. Afiliacje: [anglojęzyczna lista](https://en.wikipedia.org/wiki/List_of_prime_ministers_of_Poland) i podlinkowane biogramy. Dane faktograficzne opracowano do własnego zestawienia; opis metodologii znajduje się na stronie.

Stosujemy różnicę dat, bez doliczania dnia końcowego. Daty historyczne zachowują luki i wyjątki źródła. Nie przepisujemy błędnych sum dni z Wikipedii. Mazowiecki jest pokazany tylko raz, w III RP. Uwzględniamy Thugutta jako zastępującego premiera i wymienione w polskim źródle misje bez utworzenia gabinetu. Kolejne gabinety bez przerwy łączymy w jeden okres; przerwy pozostają oddzielne.

Aktualny okres Tuska kończy się dynamicznie na bieżącej dacie w Europe/Warsaw. Strona kontroluje zmianę daty co 30 sekund oraz po powrocie do karty. Zmiana premiera wymaga wpisania daty końcowej i dodania nowego rekordu — automatyczne jest liczenie dni, nie wykrywanie zmian politycznych.

Kolory III RP według załączonego wzoru użytkownika, historyczne według obozów. Pierwszy okres Cyrankiewicza rozdziela PPS i PZPR. Eksport CSV zawiera źródłowe okresy aktualnie widocznych osób, także w widoku sum.

## Testy

`node test.cjs` — daty referencyjne, sumowanie, rok przestępny, czas letni i północ warszawska.

## GitHub Pages

Publikacja z gałęzi `main`, katalog `/ (root)`. Plik `.nojekyll` wyłącza przetwarzanie Jekyll.
