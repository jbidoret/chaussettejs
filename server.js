import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import {writeFileSync} from "fs"

// config
const port = process.env.PORT || 3000;
// const ip = process.env.IP || 'localhost';
const ip = process.env.IP || '192.168.2.101';

const app = express();
app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server);

// serve public dir
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// returns id from headers
async function computeUserIdFromHeaders(headers) {
  return headers.id
}

// main
io.on('connection', async (socket) => {
  
  // connection
  console.log(`Client (${socket.id }) is now connected`);
  
  // send back id to user only
  const userId = await computeUserIdFromHeaders(socket);
  socket.join(userId);
  io.to(userId).emit("welcome", userId);
  
  // message
  socket.on('message', (msg) => {
    console.log("Message !");
    console.log(msg);
    io.emit('message', msg);
  });

  // file URL
  socket.on('video', (url) => {
    console.log("Vidéo !");
    console.log(url);
    io.emit('video', url);
  });

  // message as object
  socket.on('questionsreponses', (obj) => {
    console.log("Questions !");
    console.log(obj);
    io.emit('questionsreponses', obj);
  });

  // special
  socket.on('special', (something) => {
    console.log("Special !");
    console.log(something);
    io.of("/special").to('/special').emit('special', something);
  });

  // disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // feeedback
  socket.on('feeedback', () => {
    console.log('feeedback');
  });
});



io.of("/special").on("connection", (socket) => {
  // print users
  const userId = socket.id;
  console.log(`Special user (${userId}) is now connected`);

  socket.join("/special");

  io.of("/special").to("/special").emit("welcome", userId);
 
  // disconnection
  socket.on('disconnect', () => {
    console.log('Special user disconnected');
  });


  // special signal
  socket.on('Specializing', (msg) => {
    console.log('Specializing !');
    console.log(msg);
    // attempt to send message to a user identified by its userid
    // msg = { userdid: …, data: … }
    io.to(msg.userid).emit('Received specializing', { }, (err, responses) => {
      console.log(err);
    });
  });

});

// server.listen(3000, () => {
server.listen(port, ip, function () {
  console.log(`Server is running at http://${ip}:${port}`);
});

// receive an base64 image and write it to disk
function writeMessage(msg){
  console.log("writeMessage");

  // filename
  const p = "export/"+ new Date().getTime() + ".png";
  const pp = "public/" + p;
  
  // parse b64
  var d = msg.dataURL;
  var data = d.split(',')[1]; 
  var buf = Buffer.from(data, 'base64'); 

  // write file
  writeFileSync(pp, buf, err => {
    console.log("Wrote Message");
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      console.log("file written successfully");     
    }
  });

  // send feedback
  io.emit('feedback', {
    url: `http://${ip}:${port}/${p}`,
    from: msg.userid,
  }, (err, responses) => {
    console.log(err);
  });  
  
}