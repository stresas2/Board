# Board

Numeriukų švieslentė ir jos valdymas<br />
LIVE LINK: http://board.mygidas.lt/<br />
FRONT-END dalis (visi duomenys išsisaugo LocalStorage)<br /><br />

Susideda iš 5 puslapių:
* index.html - Švieslentė su numeriukais;
* newclient.html - Kliento registraciją;
* specialist.html - Aptarnaujančio specialisto tinklalapis;
* checkclient.html - Kliento galimos operacijos;
* calendar.html - Kalendorius su statistika;

Kiekvienas puslapis turi savo JS failiuką, kuris jį valdo.

## Data

Kiekvienas klientas aprašomas JSON formato objektu:
```
{
    "numeris": 1, // Priskirtas numeriukas Klientui
    "vardas": "Lukas", // Kliento vardas
    "code": 123456, // Klientui sugeneruotas kodas
    "specialistas": 1, // Kliento pasirinktas specialistas
    "time": null, // Timestamp kada klientas buvo pradėtas aptarnauti
    "finishTime": null, // Laikas per kurį klientas buvo aptarnautas
    "done": false // Kliento aptarnavimo statusas (false - neaptarnautas, true - aptarnautas)
  }
 ```
 
 Duomenys išsaugojami į du LocalStorage kintamuosius:
 * Klientai - Visi įrašai nepriklausomai ar aptarnauti ar ne, atvaizduoti pagal tikrą eiliškumą;
 * Atlikt - Visi aptarnauti klientai;

## Usage

### index.html - Švieslentė

Veikimas:
* Nuskaito duomenis iš "LocalStorage";
* Suskirsto duomenis pagal specialistą;
* Duomenys atvaizduojami pagal eiliškumą, kuo labiau į viršų tuo greičiau prieis eilę;
* Pirmas, atvaizduotas kita spalva yra dabar aptarnaujamas;
* Dešinėja pusėja apskaičiuojamas preleminarus laukimo laikas kiekvienam numeriui. Paimi visi duomenys iš istorijos kuriuos aptarnavimo specialistas ir suskaičiuojamas jų vidurkis ir dauginama iš eilės numerio pas specialistą, jeigu nėra duomenų nustatomas vidutinis laikas 6min;

### newclient.html - Kliento registraciją;

Veikimas:
* Nuskaitomas pasirinktas specialistas ir įvestas vardas;
* Visi laukeliai privalo būti užpildyti;
* Vardas privalo būti sudarytas tik iš raidžių, turi būti vienas žodis ir negalimas vardas - Vardenis;
* Neatitikus aukščiau išvardintų kriterijų išmetamas pranešimas;
* Teisingai užpildus sugeneruojamas apsaugos kodas ir aukščias rastas laisvas numeris ir šitie duomenys išmetami pranešime vartotojui;

### specialist.html - Aptarnaujančio specialisto tinklalapis;
Veikimas:
* Kairėja pusėja yra mygtukas "Įrašyti Klientus" nuspaudus juos vykdoma "AJAX" užklausa į "Klientai.JSON", nuskaitomi duomenys ir įrašomi į LocalStorage "Klientai", neradus failiuko išmetamas pranešimas;
* Dešinėja pusėja pasirinkus specialistą pasileidžia programa ir atspausdinami specialisto klientai lentelėja su jų numeriu ir vardu;
* Pirmam Klientui lentėja priskiriamas "timestamp" kuomet jis pradedamas aptarnauti ir išsaugojami duomenys LocalStorage;
* Paspaudus mygtuką "Aptarnauti" nuskaitomas dabartinis laikas ir laikas kada jis buvo pradėtas aptarnauto iš to apskaičiuojamas jo aptarnavimo laikas, kuris atvaizduojamas lentelėja. Kliento duomenys pasipildo aptarnavimo laiku ir aptarnavimo statusu "done: true" ir duomenys išsaugojami LocalStorage - Klientai ir Atlikti;
* Lentelė perspaudinama įvykus LocalStorage pasikeitimams;

### checkclient.html - Kliento galimos operacijos;
Veikimas:
* Nuskaito įvestą numeriuką ir nuspaudus "Tikrinti laiką" parodo laukimo laiką, jeigu numeriukas neegzistuoja arba jau buvo aptarnautas išmeta pranešima;
* Laukimo laikas atnaujinamas kas 5s. Yra virtualus laikrodukas kuris iš suskaičiuoto laukimo laiko atiminėja praėjusį laiką, jeigu numeriukas arba numeriuko eiliškumas pasikeitė laikrodukas nusinuliną ir pradeda iš naujo skaičiuoti, taip duomenys pastoviai atsinaujina priklausomai kaip keičiasi vidutinis specialisto aptarnavimo laikas. Pasidarius laukimo laikui 0 pridedama minutė ir vėl skaičiuojamas, kol klientas prieina eilę;
* Nuspaudus "Atšaukti vizitą" nuskaitomas įvestas numeriukas ir kodas, patikrinami ar jie sutampa su tais kurie išsaugoti LocalStorage, jeigu ne išmetamas pranešimas, priešingu atveju vizitas atšaukiamas jis ištrinimas iš LocalStorage ir išmetas pranšimas apie sėkmingą atšaukimą;
* Nuspausdus "Pavėlinti vizitą" Nuskaitomas numeris ir kodas, surandamas jo vizito eiliškumas LocalStorage ir jis perstumiamas žemyn, perstumiant atsižvelgiama, kad būtų perstumiamas būtinai pas jo pasirinktą specialistą, jeigu nėra kur perstumti išmetamas pranešimas, kad jis yra paskutinis eilėja;

### calendar.html - Kalendorius su statistika;
Veikimas:
* Nuskaitomi duomenys iš LocalStorage;
* Duomenys išfiltruojami pagal aptarnavimo datą;
* Suskaičiuojami kiek kiekviena diena buvo vizitų, pagal vizitų skaičiu keičiasi dienos fonas;
* Apskaičiuojama kuri dienos pusė buvo laisvesnė ir atvaizduojama prie dienos numeriuko, P - pirmoji dienos pusė iki 12h, A - antroji dienos pusė, N - Nebuvo klientų visai.  
* Galima tikrinti visus metų menesius nepriklausomai ar buvo vizitų ar ne;
* Galima tikrinti pagal specialistą arba žiūręti bendra visu specialistų statistiką;
* Kalendorius pritaikytas vaizduoti per visą ekrana ir prisitaiko prie ekrano dydžio;
