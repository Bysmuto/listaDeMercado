import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  remove,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnB9X0DqWdbHpvlPl_Luz0ZsmJMto3FJw",
  authDomain: "opendatabase-5d54a.firebaseapp.com",
  databaseURL: "https://opendatabase-5d54a-default-rtdb.firebaseio.com",
  projectId: "opendatabase-5d54a",
  storageBucket: "opendatabase-5d54a.appspot.com",
  messagingSenderId: "548001499521",
  appId: "1:548001499521:web:5231564f084ce287af4080",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let currentDb = "listaDeMercado";

//Html
let inputHtml = document.querySelector("#input");
let itensHtml = document.querySelector("#itens");

function addItemDb(path, value) {

  push(ref(db, path), value);
}

function inputToDb() {
  inputHtml.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      playSound("add",0.5);

      addItemDb(currentDb, inputHtml.value);
    } else {
      playSound("inputTyping",0.3);
    }
  });

  //input sound
  inputHtml.addEventListener("click", () => {
    playSound("input",0.08);
  });
}

function removeItemDb(path, id) {
  let itemToRemove = ref(db, `${path}/${id}`);


  remove(itemToRemove);
}

function displayItens(currentDb) {
  onValue(ref(db, currentDb), (snapshot) => {
    if (snapshot.exists()) {
      itensHtml.innerHTML = "";
      let itensOnDb = snapshot.val();
      let itensArray = Object.entries(itensOnDb);

      for (let i = 0; i < itensArray.length; i++) {
        let itensId = itensArray[i][0];
        let itensValue = itensArray[i][1];

        addItemHtml(itensValue, itensId);
      }
    } else {
      itensHtml.innerHTML = "";
    }
  });
}

function addItemHtml(value, id) {
  inputHtml.value = "";

  let itemHtml = document.createElement("div");

  itemHtml.className = "item";
  itemHtml.id = id;
  itemHtml.textContent = value;

  itensHtml.append(itemHtml);

  function itemfuncs() {
    //deletar o id do item ao clicar (tem que ser depois de anexar no div)
    let allItens = document.querySelectorAll(".item");

    allItens.forEach((e) => {
      e.onclick = (e) => {
        let idOfitem = e.currentTarget.id;
        removeItemDb(currentDb, idOfitem);
        playSound("remove",0.5);
      };
    });
  }

  itemfuncs();
}

function runApp(db) {
  inputToDb();
  displayItens(db);
}

function playSound(sound,volume) {

  if (sound == "add") {
    let audio = new Audio("souds/add2.wav");
    audio.volume = 0.5
    audio.play();
  }

  if (sound == "remove") {
    let audio = new Audio("souds/remove2.wav");
    audio.volume = 1
    audio.play();
  }

  if (sound == "input") {
    let audio = new Audio("souds/input.wav");
    audio.volume = 0.1
    audio.play();
  }

  if (sound == "inputTyping") {
    let audio = new Audio("souds/type.wav");
    audio.volume = 0.3
    audio.play();
  }
}

runApp(currentDb);

//teste git