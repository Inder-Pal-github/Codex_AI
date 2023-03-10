import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const url = "https://openai-kvov.onrender.com/";
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

// loading effect of ...
let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}
// ---

// --text typing
function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// unique id generator

function generateUniqeId() {
  const timestamp = Date.now();

  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

// chat stripe
function chatStripe(isAi, value, uniqueId) {
  return `<div class="wrapper ${isAi && "ai"} >
      <div class = "chatContainer" >
        <div class = "profile">
        <img 
          src="${isAi ? bot : user}"
          alt="${isAi ? "bot" : "user"}"
        />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>`;
}

// submit function
async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatsripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  // bot's chatsripe
  const uniqueId = generateUniqeId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch data from server
  const response = await fetch("https://openai-kvov.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: data.get("prompt") }),
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    console.log(parsedData);
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    console.log(err);
    messageDiv.innerHTML = "Something went wrong!";
    alert(err);
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
