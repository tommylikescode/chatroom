var express = require('express'),
app = express(),
http = require('http').createServer(app),
path = require('path'),
io = require('socket.io')(http),
port = process.env.port || 3000;

//exisiting usernames
var names = [];

//link to stylesheet
app.use(express.static(path.join(__dirname, 'public')));

//get request for index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  function updateUsernames() {
    io.sockets.emit('usernames', names);
  }
  socket.on('disconnect', function(msg){
    if (!socket.username) return;
    names.splice(names.indexOf(socket.username), 1);
    updateUsernames();
    io.emit('disconnect', msg);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', { text : msg, user : socket.username });
  });
  socket.on('enter user', function(data, callback) {
    if ( names.indexOf(data) != -1 ) {
      callback(false);
    } 
    else {
      callback(true);
      socket.username = data;
      names.push(socket.username);
      updateUsernames();
    }
  });
  
   socket.on('connect', function(data){
    io.emit('connect', data);
  });
});

http.listen(port, function(){
  console.log('listening on port :3000');
});