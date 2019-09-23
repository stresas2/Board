// Seka ar nėra pasikeitimu storage, jei taip perpiešia švieslentę
window.addEventListener("storage", () => drawNumbers(), false);

// Piešia švieslentę
const drawNumbers = () => {
  let clientData;

  // Tikrina ar yra išsaugotų duomenų storage
  if (localStorage.getItem("klientai") !== null) {
    clientData = JSON.parse(window.localStorage.getItem("klientai"));
  } else {
    clientData = [];
  }

  // Atskiriami duomeny pagal specialistą
  const firstData = clientData.filter(data => {
    if (Number(data["specialistas"]) === 1) {
      return data;
    }
  });

  const secondData = clientData.filter(data => {
    if (Number(data["specialistas"]) === 2) {
      return data;
    }
  });

  // Ištrinama sena švieslentė
  document.getElementById("firstBoard").innerHTML = "";

  let index1 = 0;

  // Piešama pirmo specialisto švieslentė
  firstData.forEach(element => {
    if (index1 < 5) {
      let object;
      if (element["done"] === false) {
        if (index1 === 0) {
          object = `<div class='bg-info rounded shadow-sm mb-2 w3-animate-opacity'>
              <p class='h1 digital m-0 text-center'>${element["numeris"]
                .toString()
                .padStart(4, 0)}</p>
          </div>`;
        } else {
          object = `<div class='bg-light rounded shadow-sm parentDiv mb-2 w3-animate-opacity'>
              <p class='h1 digital m-0 text-center'>${element["numeris"]
                .toString()
                .padStart(4, 0)}</p>
              <p class='h5 digital mt-1 mr-1 childDiv'>~ ${getTime(element)}</p>
          </div>`;
        }
        index1++;
        document.getElementById("firstBoard").innerHTML += object;
      }
    }
  });

  document.getElementById("secondBoard").innerHTML = "";

  let index2 = 0;

  // Piešama antro specialisto švieslentė
  secondData.forEach(element => {
    if (index2 < 5) {
      let object;
      if (element["done"] === false) {
        if (index2 === 0) {
          object = `<div class='bg-info shadow-sm rounded mb-2 w3-animate-opacity''>
              <p class='h1 digital m-0 text-center'>${element["numeris"]
                .toString()
                .padStart(4, 0)}</p>
          </div>`;
        } else {
          object = `<div class='bg-light rounded shadow-sm parentDiv mb-2 w3-animate-opacity''>
              <p class='h1 digital m-0 text-center'>${element["numeris"]
                .toString()
                .padStart(4, 0)}</p>
              <p class='h5 digital mt-1 mr-1 childDiv'>~ ${getTime(element)}</p>
          </div>`;
        }
        index2++;
        document.getElementById("secondBoard").innerHTML += object;
      }
    }
  });
};

// Apskaučiuojamas laukimo laikas
const getTime = element => {
  let dataDone;
  let avarageTime;

  // Tikrina ar yra išsaugotų duomenų storage
  if (localStorage.getItem("atlikti") !== null) {
    dataDone = JSON.parse(window.localStorage.getItem("atlikti"));
    dataDone = dataDone.filter(
      data => data["specialistas"] === element["specialistas"]
    );

    // Apskaičiuojame vidutinį atlikimo laiką remdamiesi praeitais laikais
    if (dataDone.length > 0) {
      const timeArray = dataDone.map(data => data["finishTime"]);
      let timSum = 0;
      timeArray.forEach(iteam => (timSum += iteam));
      let avarage = timSum / timeArray.length;
      avarageTime = avarage;
    } else {
      avarageTime = 480;
    }
  } else {
    // Jeigu nėra duomenų ties atliktais klientais nustatoma, kad vidutinis laikas per klientą bus 8min
    avarageTime = 480;
  }

  // Apskaičiuojame kuris eilėja pas specialistą yra numeriukas
  let listData = JSON.parse(localStorage.getItem("klientai"));

  listData = listData.filter(
    data =>
      data["done"] === false && data["specialistas"] === element["specialistas"]
  );

  const index = listData.findIndex(
    data => data["numeris"] === element["numeris"]
  );

  // Apskaičiuojam ir gražinam laiką
  const time = index * avarageTime;
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 24;

  return `${hours}:${minutes
    .toString()
    .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
};

drawNumbers();
