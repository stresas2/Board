// Mėnesiu pavadinimai lietuviškai
const monthsNames = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegužė",
  "Birželis",
  "Liepa",
  "Rugpjūtis",
  "Rugsėjis",
  "Spalis",
  "Lapkritis",
  "Gruodis"
];

// Puslapio funkcijų pradžia
const startPage = () => {
  const now = new Date(),
    nowMth = now.getMonth();

  // Įterpiam mėnesius
  const mth = document.getElementById("month2");
  for (let i = 0; i < 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = monthsNames[i];
    if (i === nowMth) {
      opt.selected = true;
    }
    mth.appendChild(opt);
  }

  // Piešiame kalendorių
  createCalendar();
};

const createCalendar = () => {
  // Nustatome metus ir dabartinį mėnesį
  const sMth = Number(document.getElementById("month2").value);
  const sYear = 2019;

  var daysInMth = new Date(sYear, sMth + 1, 0).getDate(), // Apskaičiuojama kiek dienų mėnesyje
    startDay = new Date(sYear, sMth, 0).getDay(), // Apskaičiuojama kelintadieni prasideda mėnesis
    endDay = new Date(sYear, sMth, daysInMth - 1).getDay(); // Apskaičiuojama kelintadieni pasibaigia mėnesis

  // Kuriame mėnesio rodyklę, kai diena neegzistuoja rašome emty
  const squares = [];
  if (startDay != 0) {
    for (let i = 0; i < startDay; i++) {
      squares.push("emty");
    }
  }

  // įterpiame egzistuojančias dienas
  for (let i = 1; i <= daysInMth; i++) {
    squares.push(i);
  }

  // įterpiame neegzistuojančias dienas (emty)
  if (endDay != 6) {
    let blanks = endDay == 0 ? 6 : 6 - endDay;
    for (let i = 0; i < blanks; i++) {
      squares.push("emty");
    }
  }

  const container = document.getElementById("calendar"),
    cTable = document.createElement("table");

  cTable.classList.add("w3-animate-opacity");
  cTable.id = "calendar";
  cTable.classList.add("m-0");

  container.innerHTML = "";
  container.appendChild(cTable);

  // Kuriame kalendorių pagal sukurta kalendoriaus rodyklę
  let cRow = document.createElement("tr"),
    cCell = null,
    days = ["Pirm", "Ant", "Tre", "Ket", "Penk", "Šeš", "Sek"];
  for (let d of days) {
    cCell = document.createElement("td");
    cCell.classList.add(
      "bg-dark",
      "text-light",
      "rounded",
      "py-3",
      "m-2",
      "shadow",
      "text-center"
    );
    cCell.innerHTML = d;
    cRow.appendChild(cCell);
  }
  cRow.classList.add("day");
  cTable.appendChild(cRow);

  const total = squares.length;

  cRow = document.createElement("tr");

  for (let i = 0; i < total; i++) {
    cCell = document.createElement("td");
    if (squares[i] === "emty") {
      cCell.classList.add("bg-secondary", "rounded", "p-2", "m-2", "shadow");
    } else {
      cCell.classList.add(
        "bg-light",
        "rounded",
        "py-3",
        "m-2",
        "shadow",
        "text-center"
      );
      const occupancy = daysOccupancy(sMth, squares[i]);

      // Nusipalvinam kalendoriaus langelius pagal jų užimtumą
      if (occupancy[0] > 0) {
        cCell.classList.add("firstLevel");
        if (occupancy[0] > 5) {
          cCell.classList.add("secondLevel");
        }
        if (occupancy[0] > 10) {
          cCell.classList.add("thirdLevel");
        }
      }

      const time = ["N", "P", "A"];

      // Įrašoma diena ir pažymime kuri dienos pusė laisvesnė
      cCell.innerHTML = `<div><b>${squares[i]}</b> <small>${
        time[occupancy[1]]
      }</small></div>`;
    }
    cRow.appendChild(cCell);
    if (i != 0 && (i + 1) % 7 == 0) {
      cTable.appendChild(cRow);
      cRow = document.createElement("tr");
    }
  }
};

// Skaičiuojame dienos užimtumą
const daysOccupancy = (sMth, sDay) => {
  let doneData = JSON.parse(localStorage.getItem("atlikti"));
  const selectedMoth = sMth;
  const selectedDay = sDay;
  const specialist = Number(document.getElementById("specialist").value);
  let dataByMothAndDay;

  // Jeigu nėra jokių įrašų gražiname nulius - diena neužimta visai ir abi pusės laisvos
  if (doneData === null) {
    return [0, 0];
  }

  // Suskirstome atliktų klientų duomenis pagal specialistų pasirinkimus
  if (specialist === 0) {
    dataByMothAndDay = doneData.filter(
      data =>
        new Date(data["time"]).getMonth() === selectedMoth &&
        new Date(data["time"]).getDate() === selectedDay
    );
  } else {
    dataByMothAndDay = doneData.filter(
      data =>
        new Date(data["time"]).getMonth() === selectedMoth &&
        new Date(data["time"]).getDate() === selectedDay &&
        data["specialistas"] === specialist
    );
  }

  // Jeigu diena neturi jokių įrašų pagal nustatymus gražiname nulius - diena neužimta visai ir abi pusės laisvos
  if (dataByMothAndDay.length === 0) {
    return [0, 0];
  }

  // Išsiskaičiuojame tos dienos vidurdienį
  let checkTime;
  const midday = new Date(2019, selectedMoth, sDay, 12, 00).getTime();

  // Tikriname kurioje dienos pusėja buvo aptarnauti klientai
  const firstPartDay = doneData.filter(data => data["time"] - midday < 0);
  const secondPartDay = doneData.filter(data => data["time"] - midday > 0);

  // Lyginame kurioje dienos pusėja klientų buvo aptarnauta daugiau
  if (firstPartDay < secondPartDay) {
    checkTime = 1;
  } else {
    checkTime = 2;
  }

  const finishData = [dataByMothAndDay.length, checkTime];

  return finishData;
};

startPage();
