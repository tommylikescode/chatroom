var express = require('express'),
app = express(),
http = require('http').createServer(app),
path = require('path'),
io = require('socket.io')(http),
port = process.env.port || 3000;

//link to stylesheet
app.use(express.static(path.join(__dirname, 'public')));

//get request for index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  socket.on('connect', function(msg){
    io.emit('connect', msg);
  });
  socket.on('disconnect', function(msg){
    io.emit('disconnect', msg);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
});

http.listen(port, function(){
  console.log('listening on port :3000');
});