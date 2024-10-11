const socket = io();
let userid = null;
const v = document.querySelector('#video');
const q = document.querySelector('#questions');

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
});


socket.on('video', (data) => {
  console.log("video !");
  console.log(data);
  v.src = `videos/${data}`;
  v.addEventListener("canplay", () => {
    v.play();
  });
});



socket.on('question reponse', (data) => {
  console.log("Question reponse !");
  console.log(data);
  q.innerHTML = `<p><strong class="question">${data.question}</strong><br><span class="answer">&mdash; ${data.answer}</span></p>`;  
});

socket.on('age genre', (data) => {
  console.log("Age genre !");
  console.log(data);
  q.innerHTML = `<p>
    age ${data.age}<br> 
    male : ${data.male}<br>
    female : ${data.female}
    </p>`;  
});


// --------------------------- utils

// utility that maps a value within a range to another range
function scale(value,inmin,inmax,outmin,outmax){
  return ((value - inmin) * (outmax - outmin) / (inmax - inmin) + outmin).toFixed(2);
}


