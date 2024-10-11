import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import {writeFileSync} from "fs"

// config
const port = process.env.PORT || 3000;
// const ip = process.env.IP || 'localhost';
const ip = process.env.IP || '192.168.2.90';

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
    console.log("MEssage !");
    console.log(msg);
    io.emit('message', msg);
  });

  // message
  socket.on('question reponse', (msg) => {
    console.log("Question/réponse !");
    console.log(msg);
    io.emit('question reponse', msg);
  });

  // age genre
  socket.on('age genre"', (msg) => {
    console.log("Age genre !");
    console.log(msg);
    io.emit('age genre"', msg);
  });

  // video
  socket.on('video', (msg) => {
    console.log("Vidéo !");
    console.log(msg);
    io.emit('video', msg);
  });

  socket.on('special', (msg) => {
    console.log("Special !");
    console.log(msg);
    io.of("/special").to('/special').emit('special', msg);
  });

  socket.on('algo', (msg) => {
    console.log("Algo !");
    console.log(msg);
    io.of("/algo").to('/algo').emit('algo', msg);
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



io.of("/algo").on("connection", (socket) => {
  // print users
  const userId = socket.id;
  console.log(`Algo user (${userId}) is now connected`);

  socket.join("/algo");

  io.of("/algo").to("/algo").emit("welcome", userId);
 
  // disconnection
  socket.on('disconnect', () => {
    console.log('Algo user disconnected');
  });

  // printing signal
  socket.on('Specializing', (msg) => {
    console.log('Specializing !');
    console.log(msg);
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