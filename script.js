// Declarando uma variável let para armazenar a referência do elemento HTML com a classe "timer-display"
let timerRef = document.querySelector(".timer-display");

const hourInput = document.getElementById("hourInput");

const minuteInput = document.getElementById("minuteInput");

const activeAlarms = document.querySelector(".activeAlarms");

const setAlarm = document.getElementById("set");

let alarmsArray = [];

let alarmSound = new Audio("./alarm.mp3");

// Declarando variáveis let para armazenar valores iniciais de hora, minuto e índice do alarme
let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

// Declarando uma função para adicionar um zero à esquerda se o valor for menor que 10
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Declarando uma função para pesquisar um objeto em um array com base em um parâmetro e um valor
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Declarando uma função para exibir o temporizador e verificar se algum alarme deve ser acionado
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  // Exibindo o tempo no elemento HTML com a classe "timer-display"
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

  // Verificando se algum alarme ativo coincide com o tempo atual
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        // Tocando o som do alarme se houver uma correspondência
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

// Declarando uma função para verificar e corrigir o valor de entrada para a hora ou minuto
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

// Adicionando um ouvinte de evento para o elemento de entrada da hora para verificar e corrigir o valor de entrada
hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

// Adicionando um ouvinte de evento para o elemento de entrada do minuto para verificar e corrigir o valor de entrada
minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

// Declarando uma função para criar um novo alarme e adicioná-lo à lista de alarmes
const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute } = alarmObj;

  // Criando um novo elemento de div para representar o alarme
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  // Criando um elemento de caixa de seleção para ativar/desativar o alarme
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  // Criando um botão de exclusão para remover o alarme
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

// Adicionando um ouvinte de evento ao botão "set" para criar um novo alarme
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  // Criando um novo objeto de alarme
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.isActive = false;

  // Adicionando o novo alarme ao array e criando sua representação visual
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
});

// Declarando uma função para iniciar um alarme
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

// Declarando uma função para parar um alarme
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

// Declarando uma função para excluir um alarme
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    // Removendo o alarme da lista de alarmes e do DOM
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

// Configurando a função para ser chamada quando a página é carregada
window.onload = () => {
  // Configurando um intervalo para atualizar o temporizador a cada segundo
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};
