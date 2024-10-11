const socket = io("/algo");
let userid = null;
const a = document.querySelector('#algo');

// --------------------------- socket

// on connection, server sends back a welcome message to client width the socket id
socket.on('welcome', (id) => {
  userid = id;  
  console.log("My id is " + userid);
});

// --------------------------- receive messages

socket.on('algo', (data) => {
  console.log("Algo !");
  console.log(data);
  const p = document.createElement("p");
  p.innerHTML = data.text;
  p.className = data.classname;
  a.appendChild(p);
  p.scrollIntoView({behavior: "smooth"})
});

