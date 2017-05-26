// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  init: function() {},
  send: function(data) {
    $.ajax({
      type: 'POST',
      url: this.server,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function(data) {
    $.ajax({
      type: 'GET',
      url: this.server,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Load was performed');
      }
    });
  },
  clearMessages: function() {
    var chatDiv = document.getElementById('chats');
    while(chatDiv.firstChild) {
      chatDiv.removeChild(chatDiv.firstChild);
    }
  },
  renderMessage: function(message) {
    var {username, text, roomname} = message;

    var chatDiv = document.createElement('div');
    chatDiv.className = 'chat';

    var usernameDiv = document.createElement('div');
    usernameDiv.className = 'username';
    usernameDiv.textContent = username + ':';
    
    var textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = text;

    chatDiv.appendChild(usernameDiv);
    chatDiv.appendChild(textDiv);

    $('#chats').append(chatDiv);
  },

  renderRoom: function() {}
};