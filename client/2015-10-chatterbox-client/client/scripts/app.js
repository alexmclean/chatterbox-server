// YOUR CODE HERE:
var app = {

};

app.server = 'https://api.parse.com/1/classes/chatterbox';
//storage for friend list
app.isFriend = {};

$(document).ready(function(){
  console.log("called doc ready");
  $('.submit').on('click', function(event){
    event.preventDefault();
    app.handleSubmit();
  });

  $('#roomSelect').change(function(){
    app.fetch();
  });
});

app.send = function(message){
  console.log(message.roomname);
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.addMessage(message);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

function showMessages(results, roomName){
  var rooms = [];
  if(roomName === null){
    roomName = 'All Rooms';
  }
  for(var i = 0; i < results.length; i++){
    if(results[i].roomname === roomName || roomName === 'All Rooms'){
      app.addMessage(results[i]);
    }
    rooms.push(results[i].roomname);
  }
  app.buildRooms(rooms);
}


app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.clearMessages();
      showMessages(data.results, $('#roomSelect').val());

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

// build dropdown menu to select room
app.buildRooms = function(rooms){
  var $roomChecker = $('#roomSelect');
  var selected = $roomChecker.val() || 'All Rooms';
  $roomChecker.empty();
  var isDuplicate = {};
  for(var i = 0; i < rooms.length; i++){
    if(!isDuplicate[rooms[i]] && rooms[i] !== selected){
      isDuplicate[rooms[i]] = true;
      app.addRoom(rooms[i]);
    }
  }
  var $selectedNode = $('<option>' + selected + '</option>');
  $selectedNode.prependTo($('#roomSelect'));
};


app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message){
  var $node = $('<div/>', {class : 'chat', text : message['text']});
  var $user = $('<div/>', {class : 'username', text : message['username']});
  $user.on('click', function(event){
    app.addFriend($(this).html());
  });
  //console.log(app.isFriend[message['username']]);
  if (app.isFriend[message['username']]){ 
    $node.css('background-color', 'teal');
    $node.css('color', 'white'); 
  }
  $user.appendTo($node);
  $node.appendTo('#chats');
};

app.addRoom = function(roomName){
  var $choice = $('<option/>', {class : 'room', text : roomName});
  $choice.appendTo('#roomSelect');
};

app.addFriend = function(name){
  if (!app.isFriend[name]) {
    app.isFriend[name] = true;
  }
  console.dir(app.isFriend);
};

app.handleSubmit = function(){
  var roomName; 
  if($('#roomMaker').val() === ''){
    roomName = $('#roomSelect').val();
  } else {
    roomName = $('#roomMaker').val();
  }
  var userName = $('#user').val();
  var messageText = {username: userName, text: $('#message').val(), roomname : roomName};
  app.send(messageText);
};

app.init = function(){
  console.log("init");
  app.fetch();
};

app.init();
window.setInterval(app.fetch, 5000);
