// Stebi LocalStorage pakeitimus ir atsiradus perspausdina lentelę
window.addEventListener("storage", () => printOutClient(), false);

// Nuskaitom šabloną duomenų
const getClient = async () => {
  // failo pavadinimas
  const url = "klientai.json";
  let data;

  let response = await fetch(url);
  if (response.status === 200) {
    data = await response.json();
  } else if (response.status === 404) {
    // Jeigu nėra tokio failo
    data = "not found";
  } else {
    // Kitas erros
    data = "error";
  }
  return data;
};

// Įkeliam i LocalStorage
const insertClient = () => {
  // Gauname duomenis
  const result = getClient();
  // Kai duomenys suvaikšioja
  result.then(data => {
    // Tikrinam ar failas rastas jei ne išmetam pranešimą, priešingu atveju įkeliam į LocalStorage ir atspausdinam lentelę
    if (data === "not found") {
      document.getElementById("alarm").innerHTML =
        "Nepavyko nuskaityti lankytojų duomenų";
    } else if (data === "error") {
      console.log(error);
    } else {
      data = JSON.stringify(data);
      window.localStorage.setItem("klientai", data);
      document.getElementById("alarm").innerHTML = "";
      printOutClient();
    }
  });
};

const printOutClient = () => {
  // Nuskaitome pasirinkta specialistą
  let specialist = document.getElementById("selectSpecialist").value;
  specialist = Number(specialist);

  // Tikrinam ar yra jam duomenų
  if (localStorage.getItem("klientai") !== null) {
    data = JSON.parse(window.localStorage.getItem("klientai"));
  } else {
    data = [];
  }

  // Ištrinam seną lentelę
  document.getElementById("clientBoard").innerHTML = "";

  let index = 0;

  // Atspausdinam Klientų lentelę
  data.forEach(element => {
    if (element["specialistas"] === specialist) {
      let object =
        "<tr><td class='p-2'>" +
        "#" +
        element["numeris"].toString().padStart(4, 0) +
        "</td><td>" +
        element["vardas"] +
        "</td>";

      // Jei Klientas jau aptarnautas
      if (element["done"] === false) {
        object += "<td> - </td>";
      } else {
        object += "<td>" + getRealDate(element["finishTime"]) + "</td>";
      }

      // Jei Klientas neaptarnautas
      if (element["done"] === false) {
        if (index === 0) {
          if (element["time"] === null) {
            // Įrašome i LocalStorage aptarnavimo pradžia
            setStartTime(element["numeris"]);
          }
          object +=
            "<td class='text-right'><button type='button' class='btn btn-info btn-sm' onclick='doneClient(" +
            element["numeris"] +
            ")'>Aptarnauta</button></td></tr>";
        } else {
          object += "<td class='text-right'></td>";
        }

        index++;
      } else {
        object += "<td class='text-right'>Aptarnautas</td>";
      }

      object += "</tr>";
      document.getElementById("clientBoard").innerHTML += object;
    }
  });
};

// Nustatome timestamp kada klientas pradedamas aptarnauti ir įrašomas i LocalStorage
const setStartTime = number => {
  let clientData = JSON.parse(window.localStorage.getItem("klientai"));
  const selectedData = clientData.filter(data => data["numeris"] === number);
  const timeNow = Date.now();
  selectedData[0]["time"] = timeNow;
  const foundIndex = clientData.findIndex(
    el => el["numeris"] === selectedData["numeris"]
  );
  clientData[foundIndex] = selectedData;
  window.localStorage.setItem("klientai", JSON.stringify(clientData));
};

// Apskaičiuojame kiek užtruko aptarnauti klientą
const getRealDate = time => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 24;
  return `${hours}:${minutes
    .toString()
    .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
};

// Kliento aptarnavimas
const doneClient = number => {
  let clientData = JSON.parse(window.localStorage.getItem("klientai"));

  const selectedData = clientData.filter(data => data["numeris"] === number);
  selectedData[0]["done"] = true;

  // Apskaičiuojame per kiek laiko buvo aptarnautas klientas
  const timeNow = Date.now();
  let timeDone = Math.abs(timeNow - selectedData[0]["time"]) / 1000;
  selectedData[0]["finishTime"] = timeDone;

  // Įrašome, kad klientas aptarnautas
  const foundIndex = clientData.findIndex(
    el => el["numeris"] === selectedData["numeris"]
  );
  clientData[foundIndex] = selectedData;

  window.localStorage.setItem("klientai", JSON.stringify(clientData));

  // Pridedam prie aptarnautų klientų
  let doneData = JSON.parse(window.localStorage.getItem("atlikti"));
  if (doneData === null) {
    doneData = [];
  }

  doneData.push(selectedData[0]);
  window.localStorage.setItem("atlikti", JSON.stringify(doneData));

  printOutClient();
};
