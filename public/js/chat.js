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

//disable chat and prompt user for username 
//when connecting
function promptLogin() {
	$wrapper.show();
	$userForm.hide();
}

//submit form to add a user
	//if : data exists, prompt for a username
	//else : send error message 
	
$userForm.submit(function(e) {
	e.preventDefault();
	socket.emit('enter user', $userName.val(), function(data) {
		if (data) {
			promptLogin();
		} else {
			$userName.attr("placeholder", "Display name taken. Try again.");
		}
	});
	//empty form field regardless after input
	$userName.val('');
});

// print all users from user object to $userList
socket.on("usernames", function(data) {
	$userList.html('');
	var users = '';
	var len = data.length;
	//loop through data to append list w/ username to users variable
	for ( var i = 0; i < len; i++ ) {
		users += '<li class="user">' + data[i] + '</li>';
	} 
	//refresh userList with updated users variable
	$userList.html(users);
});

// form field for sending a message
$form.submit(function(e){
	// prevent actual submission of form
	e.preventDefault();
	// if : form field is populated send msg with input's value
	if ($input.val()) {
		socket.emit('message', $input.val());
	}
	// empty form field regardless after input
	$input.val('');
});

// appends user's message to $messages list
socket.on('send message', function(msg){
	$messages.append($('<li>').html("<span>" + msg.user + "</span>: " + msg.text));
});

// display a notification message when user connects
socket.on('connect', function(data) {
	$messages.append($('<li class="user-status connect">').text("A user has connected"));

});

// display a notification message when user disconnects
socket.on('disconnect', function(msg) {
	$messages.append($('<li class="user-status disconnect">').text("A user has disconnected"));
	promptLogin();
});