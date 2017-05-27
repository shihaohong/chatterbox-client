var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

  init: function() {
    this.fetch();
  },

  send: function(message) {
    $.ajax({
      type: 'POST',
      url: this.server,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(message) {
        console.log('chatterbox: Message sent');
      },
      error: function(message) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() { 
    var messages = this.messages;
    var that = this;

    $.ajax({
      type: 'GET',
      url: this.server,
      contentType: 'application/json',
      success: function(data) {
        console.log('data coming back: ', data);
        messages = data.results;
        messages.forEach((message) => {
          that.renderMessage(message);
        })
      }
    });
  },

  clearMessages: function() {
    var chatDiv = document.getElementById('chats');
    while (chatDiv.firstChild) {
      chatDiv.removeChild(chatDiv.firstChild);
    }
  },
  
  renderMessage: function(message) {
    var {username, text} = message;

    // perhaps have to add message roomname to the class?
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

  renderRoom: function(roomName) {
    var newOption = document.getElementById('roomSelect');
    var option = document.createElement('option');
    option.text = roomName;

    newOption.add(option);
  }
};

