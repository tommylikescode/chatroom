//initialization
var socket = io.connect();

//user module
var $userModule = $('.user-module');
var $userForm = $('#user-form');
var $userName = $('#display-name');

//messaging
var $form = $('.enter-message');
var $messages = $('#messages');
var $input = $('#messagebox');

$userForm.submit(function(e) {
	e.preventDefault();
	socket.emit('enter user', $userName.val(), function(username) {
		
	});
	$userName.val('');
});

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
	notifier.add({
    title         : 'User connected!',
    imgSrc        : 'img/thumb.jpg',
    text          : 'An anonymous user has connected to the chat.',
    autoRemoveMs  : 2000
});
});

socket.on('disconnect', function(msg) {
	$messages.append($('<li class="user-status disconnect">').text("A user has disconnected"));
})