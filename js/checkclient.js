// Kliento objektas
const user = {
  number: null,
  userIndex: null
};

// Laikrodis kuris skaičiuoja laika atbuline tvarka
const timeObject = {
  number: 0,
  index: 0,
  passTime: 0,
  timeOut: false,
  timeOutTime: 0,
  start: setInterval(() => {
    // Tikriname ar jau pasibaige apskaičiuotas laikas
    if (!timeObject.timeOut) {
      // Jiegu tiksi pirminis laikas (nepasibaigęs), tikriname ar nepasikeite klientu numeris ar eiliškumas jeigu ne toliau skaičiuojame laiką
      if (
        timeObject.index !== user.userIndex ||
        timeObject.number !== user.number
      ) {
        timeObject.index = user.userIndex;
        timeObject.number = user.number;
        timeObject.passTime = 1;
      } else {
        timeObject.passTime++;
      }
    } else {
      // Jeigu pasibaigė laikas tuomet iš naujo pridedam minutė ir skaičiuojam iš naujo
      if (timeObject.timeOutTime <= 0) {
        timeObject.timeOutTime = 60;
      } else {
        timeObject.timeOutTime--;
      }
    }
  }, 1000)
};

// Tikrinam laiką
const checkTime = {
  interval: null,
  start: () => {
    const number = document.getElementById("number").value;
    // Tikrinam ar nepaliktas tuščias laukelis
    if (number === "") {
      document.getElementById("alert").innerHTML = "Neįvestas numeris!";
    } else {
      // Nustatome automatinio laikroduko pradinius parametrus
      timeObject.timeOut = false;
      timeObject.timeOutTime = 60;
      user.number = Number(number);
      // Ištriname senu pranešimus
      document.getElementById("alert").innerHTML = "";
      // Ištrinam senus laikrodžio intervalus
      clearInterval(checkTime.interval);
      // Paleidžiam naują laikrodžio funkciją su nauju intervalus (5s)
      checkTime.interval = setInterval(counTime, 5000);
      // Nunilinam laikrodį ir paleidžiame
      timeObject.passTime = 0;
      timeObject.start;
      // Paleidžiame skaičiavimą likusio laiko
      counTime();
    }
  }
};

const counTime = () => {
  let dataDone;
  let avarageTime;
  const clientNumber = user.number;

  // Pasiimame klientų duomenis
  let listData = JSON.parse(localStorage.getItem("klientai"));
  let clientData;

  // Filtruojame duomenis pagal kliento numeriuką
  clientData = listData.filter(
    data => data["done"] === false && data["numeris"] === clientNumber
  );

  // Tikriname ar yra duomenų jeigu ne parodome pranešimą
  if (clientData.length == 0) {
    document.getElementById("alert").innerHTML =
      "Numeris neegzistuoja arba jo eilė praėjo!";
    document.getElementById("waitingTime").value = "";
    return "";
  } else {
    // Apsibrėžiame pas kokį specialistą priskirtas numeriukas
    const clientSpecialist = clientData[0]["specialistas"];

    // Tikriname ar istorijoje yra duomenų pas pasirinkta specialista
    if (localStorage.getItem("atlikti") !== null) {
      dataDone = JSON.parse(window.localStorage.getItem("atlikti"));
      dataDone = dataDone.filter(
        data => data["specialistas"] === clientSpecialist
      );

      // Jeigu yra apskaičiuojam vidutinį jo aptarnavimo laiką jeigu nėra tai nustatom 6min
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
      avarageTime = 480;
    }

    // Tikrinam kuris eilėja pas specialista yra numeriukas
    const dataBySpecialist = listData.filter(
      data =>
        data["done"] === false && data["specialistas"] === clientSpecialist
    );

    const index = dataBySpecialist.findIndex(
      data => data["numeris"] === clientNumber
    );

    // Jeigu pirmas, parašome, kad jis jau dabar aptarnaujamas
    if (index === 0) {
      document.getElementById("waitingTime").value = "Aptarnaujamas dabar";
      return;
    }

    let time;

    // apskaičiuojam laukimo laiką - ((eilės numeris pas specialistą x specialisto vidutinis aptarnavimo laikas) - sukurto laikroduko praėjas laikas)
    if (timeObject.timeOut) {
      time = timeObject.timeOutTime;
    } else {
      time = index * avarageTime - timeObject.passTime;
      if (time < 0) {
        time = 0;
      }
    }

    // Jeigu laikas pasibaigė pridedam papildoma 1min ir skaičiuojam toliau, kol klientas bus aptarnautas
    if (time <= 0) {
      if (clientData[0]["done"] === false) {
        timeObject.timeOut = true;
        timeObject.passTime = 0;
      } else {
        document.getElementById("waitingTime").value = "0:00:00";
        return "";
      }
    }

    // Gražiname laiką
    user.userIndex = index;

    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600) % 24;

    const timeString = `${hours}:${minutes
      .toString()
      .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;

    document.getElementById("waitingTime").value = timeString;
  }
};

// Kliento numeriuko atšaukimas
const cancel = () => {
  // Nuskaitome duomenis
  const number = Number(document.getElementById("number2").value);
  const code = Number(document.getElementById("code").value);
  let listData = JSON.parse(localStorage.getItem("klientai"));

  let selectedData;

  // Ieškome duomenu pagal duomenis įvestus
  selectedData = listData.filter(
    data => data["done"] === false && data["numeris"] === number
  );

  // Jeigu nėra duomenų išmetame ar kodas neteisingas išmetam pranešima, priešingu atveju ištrinam surastą duomeny ir atnaujinam LocalStorage
  if (selectedData.length === 0) {
    document.getElementById("alert2").className = "text-danger";
    document.getElementById("alert2").innerHTML = "Numeris neteisingas";
  } else {
    if (selectedData[0]["code"] === code) {
      let filtredData;
      filtredData = listData.filter(data => data["numeris"] !== number);
      window.localStorage.setItem("klientai", JSON.stringify(filtredData));
      document.getElementById("number2").value = "";
      document.getElementById("code").value = "";
      document.getElementById("alert2").className = "text-success";
      document.getElementById("alert2").innerHTML = "Sėkmingai atšaukėte!";
    } else {
      document.getElementById("alert2").className = "text-danger";
      document.getElementById("alert2").innerHTML = "Kodas neteisingas";
    }
  }
};

// Vizito pavėlinimas
const lateVisit = () => {
  // Nuskaitome duomenis
  const number = Number(document.getElementById("number2").value);
  const code = Number(document.getElementById("code").value);
  let listData = JSON.parse(localStorage.getItem("klientai"));

  let selectedData;
  // Ieškome duomenu pagal duomenis įvestus
  selectedData = listData.filter(
    data => data["done"] === false && data["numeris"] === number
  );

  // Jeigu nėra duomenų išmetame ar kodas neteisingas išmetam pranešima
  if (selectedData.length === 0) {
    document.getElementById("alert2").className = "text-danger";
    document.getElementById("alert2").innerHTML = "Numeris neteisingas";
  } else {
    const specialist = selectedData[0]["specialistas"];

    const checkIfisNotFirst = listData.filter(
      data => data["specialistas"] === specialist
    );

    const checkIndex = checkIfisNotFirst.findIndex(
      data => data["numeris"] === number
    );

    // Tikrinam ar teisingas kodas įvestas
    if (selectedData[0]["code"] === code) {
      if (checkIndex === 0) {
        document.getElementById("alert2").className = "text-danger";
        document.getElementById("alert2").innerHTML =
          "Pavėlinti negalima, šiuo metu aptarnaujamas";
      } else {
        let index;

        index = listData.findIndex(data => data["numeris"] === number);

        let dataBeforeIndex = listData.slice(0, index);
        let dataAfterIndex = listData.slice(index + 1, listData.length);

        const idx = dataAfterIndex.findIndex(
          element => element["specialistas"] === specialist
        );

        if (idx === -1) {
          document.getElementById("alert2").className = "text-danger";
          document.getElementById("alert2").innerHTML =
            "Pavėlinti negalima, jūs paskutinis eilėja";
        } else {
          dataAfterIndex.splice(idx + 1, 0, selectedData[0]);
          const newData = dataBeforeIndex.concat(dataAfterIndex);
          window.localStorage.setItem("klientai", JSON.stringify(newData));
          document.getElementById("number2").value = "";
          document.getElementById("code").value = "";
          document.getElementById("alert2").className = "text-success";
          document.getElementById("alert2").innerHTML = "Sėkmingai pavėlintas!";
        }
      }
    } else {
      document.getElementById("alert2").className = "text-danger";
      document.getElementById("alert2").innerHTML = "Kodas neteisingas";
    }
  }
};
