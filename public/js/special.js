
// connect to “special” room
const socket = io("/special");

const messages = document.getElementById('messages');

let userid = null, 
  msg_userid = null;

socket.on('welcome', (id) => {
  userid = "id-" + id;
  console.log("Special is connected. My id is " + userid);
});

socket.on('message', (msg) => {
  const p = document.createElement("p");
  p.innerText = msg;
  p.className = "special";
  messages.appendChild(p);
  p.scrollIntoView({ behavior: "smooth" })
});

