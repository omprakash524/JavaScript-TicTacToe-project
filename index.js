var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
// Serve files from the same directory as the application
app.use(express.static(__dirname));
const player=['X','O'];var turn =0;
let zone=['1','2','3','4','5','6','7','8','9'];
app.get('/', function (req, res) {
  // Use path.join to create the full file path
  const filePath = path.join(__dirname, 'client.html');
  
  // Send the file using res.sendFile
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    } else {
      //console.log('File sent successfully');
    }
  });
});
// Whenever someone connects, this gets executed
io.on('connection', function (socket) {
  console.log('A user connected');
socket.on("result",function(data){if(data!="DRAW"){io.emit("show",data+" WINS!!!")}else{io.emit("show","DRAW")}turn=0;});
  socket.on('X',function(data){zone[data-1]='X';socket.broadcast.emit('see',{zone:zone,pos:Number(data),who:'X'});});
  socket.on('O',function(data){zone[data-1]='O';socket.broadcast.emit('see',{zone:zone,pos:Number(data),who:'O'});});
  socket.on('assignme', function(data){socket.emit('assignpl',player[turn++]);});
  socket.emit('sym',player[turn]);
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(3000, function () {
  console.log('Listening on *:3000');
});
