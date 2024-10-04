const socket = io();
let userid = null;
const v = document.querySelector('#video');
const f = document.querySelector('#feedback');

// --------------------------- socket

// on connection, server sends back a welcome message to client width the socket id
socket.on('welcome', (id) => {
  userid = id;  
  console.log("My id is " + userid);
});


// --------------------------- send message
function sendMessage(msg){  
  console.log("message !");
  // console.log(msg);
  socket.emit("chat message", msg);
}

// --------------------------- receive messages
socket.on('feedback', (data) => {
  console.log("feedbback !");
  console.log(data);
  f.innerHTML = `<p>— ${data}</p>`;
});


socket.on('video', (data) => {
  console.log("video !");
  console.log(data);
  v.src = `videos/${data}`;
  v.addEventListener("canplay", () => {
    v.play();
  });
});


// --------------------------- utils

// utility that maps a value within a range to another range
function scale(value,inmin,inmax,outmin,outmax){
  return ((value - inmin) * (outmax - outmin) / (inmax - inmin) + outmin).toFixed(2);
}
