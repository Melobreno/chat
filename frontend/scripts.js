// Login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

// Chat elements
const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const formatHoraEnvio = (date) => {
  return `${date.getHours()}:${date.getMinutes()} ${
    date.getHours() >= 12 ? "PM" : "AM"
  }`;
};

const user = { id: "", name: "", color: "" };

let websocket;

const creatMessageSelf = (content, horaEnvio) => {
  const div = document.createElement("div");
  const spanContent = document.createElement("span");
  const spanHours = document.createElement("span");

  div.classList.add("message__self");
  spanHours.classList.add("hours_send");

  spanContent.innerHTML = content;
  spanHours.innerHTML = horaEnvio;

  div.appendChild(spanContent);
  div.appendChild(spanHours);
  return div;
};

const creatMessageOther = (content, sender, senderColor, horaEnvio) => {
  const div = document.createElement("div");
  const spanSender = document.createElement("span");
  const spanContent = document.createElement("span");
  const spanHours = document.createElement("span");

  div.classList.add("message__other");
  spanSender.classList.add("message__sender");
  spanContent.classList.add("message__content");
  spanHours.classList.add("hours_send");
  spanSender.style.color = senderColor;

  spanSender.innerHTML = sender;
  spanContent.innerHTML = content;
  spanHours.innerHTML = horaEnvio;

  div.appendChild(spanSender);
  div.appendChild(spanContent);
  div.appendChild(spanHours);

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content, horaEnvio } = JSON.parse(data);

  const message =
    userId == user.id
      ? creatMessageSelf(content, horaEnvio)
      : creatMessageOther(content, userName, userColor, horaEnvio);

  chatMessages.appendChild(message);

  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID(); // gera um Id aleatório para o usuario e joga para o userId
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("wss://chat-backend-u2gs.onrender.com");
  websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
  event.preventDefault();

  const horaEnvio = formatHoraEnvio(new Date());

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    horaEnvio: horaEnvio,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
