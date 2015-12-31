var socket = io.connect();
var $form = $('form');
var $messages = $('#messages');
var $input = $('#messagebox');

$form.submit(function(e){
	e.preventDefault();
	socket.emit('chat message', $input.val());
	$input.val('');
});

socket.on('chat message', function(msg){
	$messages.append($('<li>').text(msg));
});

socket.on('connect', function(msg) {
	$messages.append($('<li class="user-status connect">').text("A user has connected"));
});

socket.on('disconnect', function(msg) {
	$messages.append($('<li class="user-status disconnect">').text("A user has disconnected"));
})