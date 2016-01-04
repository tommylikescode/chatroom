var express = require('express'),
app = express(),
http = require('http').createServer(app),
path = require('path'),
io = require('socket.io')(http),

//if no specified port, use default port :3000
port = process.env.port || 3000;

//existing usernames
var users = {};

//link to client
app.use(express.static(path.join(__dirname, 'public')));

//get request for index
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  
  //updates usernames to users object
  function updateUsernames() {
    io.sockets.emit('usernames', Object.keys(users));
  }
  
  //disconnect event
  //if username doesn't exist, do nothing
  //else delete username and update usernames object
  socket.on('disconnect', function(msg){
    if (!socket.username) return;
    delete users[socket.username];
    updateUsernames();
    io.emit('disconnect', msg);
  });
  
  //send message event
  socket.on('message', function(msg){
    var msgString = msg.trim();
    if (msgString.substr(0, 4) === "/pm ") {
      msgString = msgString.substr(4);
      console.log("Private message");
    } else {
      io.emit('send message', { text : msg, user : socket.username });
    }
    
  });
  
  //add a user event
  //if usernames is not in existing username object :
    //username is key, and socket as value
    //update the usernames object
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
  
//connect event
   socket.on('connect', function(data){
    io.emit('connect', data);
  });
});

//listen to default port
http.listen(port, function(){
  console.log('listening on port :3000');
});