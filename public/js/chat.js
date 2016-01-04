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
var $messages = $('#messages');
var $input = $('#messagebox');

$menuIcon.on("click", function() {
	$userModule.toggleClass("active");
	$(this).toggleClass("active");
});

function promptLogin() {
	$wrapper.show();
	$userForm.hide();
}

$userForm.submit(function(e) {
	e.preventDefault();
	socket.emit('enter user', $userName.val(), function(data) {
		if (data) {
			promptLogin();
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

socket.on('send message', function(msg){
	$messages.append($('<li>').html("<span>" + msg.user + "</span>: " + msg.text));
});

socket.on('connect', function(data) {
	$messages.append($('<li class="user-status connect">').text("A user has connected"));

});

socket.on('disconnect', function(msg) {
	$messages.append($('<li class="user-status disconnect">').text("A user has disconnected"));
	promptLogin();
});