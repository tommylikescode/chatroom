//initialization
var socket = io.connect();

//nav 
var $menuIcon = $('nav .menu-icon');

//user module
var $userModule = $('.user-module');
var $userForm = $('#user-form');
var $userName = $('#display-name');
var $userList = $('.user-list ul');

//messaging
var $wrapper = $('.wrapper');
var $form = $('.enter-message');
var $mesWrapper = $('.message-wrapper');
var $messages = $('#messages');
var $input = $('#messagebox');


$menuIcon.on("click", function() {
	$userModule.toggleClass("active");
	$(this).toggleClass("active");
});

$userForm.submit(function(e) {
	e.preventDefault();
	socket.emit('enter user', $userName.val(), function(data) {
		if (data) {
			$wrapper.show();
			$userForm.hide();

		} else {
			$userName.attr("placeholder", "Display name taken. Try again.");
		}
	});
	$userName.val('');
});

socket.on("usernames", function(data) {
	$userList.html('');
	var users = '';
	var len = data.length;
	for ( var i = 0; i < len; i++ ) {
		users += '<li class="user">' + data[i] + '</li>';
	} 
	
	$userList.html(users);
});

$form.submit(function(e){
	e.preventDefault();
	if ($input.val()) {
		socket.emit('message', $input.val());
	}
	$input.val('');
});

socket.on('message', function(msg){
	$messages.append($('<div class="clearfix">').html("<li><span>" + msg.user + "</span>: " + msg.text + "</li>"));
});

socket.on('connect', function(data) {
	$messages.append($('<div class="clearfix">').html('<li class="user-status connect">A user has connected</li>'));
});

socket.on('disconnect', function(msg) {
	$messages.append($('<div class="clearfix">').html('<li class="user-status disconnect">A user has disconnected</li>'));
});