var express = require('express'),
app = express(),
http = require('http').createServer(app),
path = require('path'),
io = require('socket.io')(http),
port = process.env.port || 3000;

//exisiting usernames
var users = {};

//link to client
app.use(express.static(path.join(__dirname, 'public')));

//get request for index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  function updateUsernames() {
    io.sockets.emit('usernames', Object.keys(users));
  }
  socket.on('disconnect', function(msg){
    if (!socket.username) return;
    delete users[socket.username];
    updateUsernames();
    io.emit('disconnect', msg);
  });
  socket.on('message', function(msg){
    var msgString = msg.trim();
    if (msgString.substr(0, 4) === "/pm ") {
      msgString = msgString.substr(4);
      console.log("Private message");
    } else {
      io.emit('send message', { text : msg, user : socket.username });
    }
    
  });
  socket.on('enter user', function(data, callback) {
    if ( data in users ) {
      callback(false);
    } 
    else {
      callback(true);
      socket.username = data;
      users[socket.username] = socket;
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