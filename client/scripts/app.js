var app = {
  
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

  messages: [],

  init: function() {
    this.fetch();
    var boundRender = this.renderRoom.bind(this);
    setTimeout( boundRender(this.messages), 2000);

    this.update();
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
    var extractMessage = this.extractMessage.bind(this);

    $.ajax({
      type: 'GET',
      url: this.server,
      contentType: 'application/json',
      success: function(data) {
        console.log('data coming back: ', data);
        data.results.forEach((message) => {
          extractMessage(message);
        });
      }
    });
  },

  extractMessage: function(message) {
    this.messages.push(message);
  },

  clearMessages: function() {
    $('#chats').empty();
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

  renderRoom: function(messages) {
    var roomnames = {};
    $('#roomSelect').empty();

    messages.forEach( function(message) {
      if (message.roomname) {
        roomnames[message.roomname] = true;
      }
    });

    Object.keys(roomnames).forEach( function(roomname) {
      var newOption = document.getElementById('roomSelect');
      var option = document.createElement('option');
      option.text = roomname;
      newOption.add(option);
    });
  },

  update: function() {
    console.log('update called');
    var selectedRoom = 'loccy'; // Gotta grab the current room from DOM
    var renderMessage = this.renderMessage;

    this.clearMessages();
    this.renderRoom(this.messages);
    this.messages.forEach( function(message) {
      if (message.roomname === selectedRoom) {
        renderMessage(message);
      }
    });
    boundUpdate = this.update.bind(this);
    setTimeout(boundUpdate, 500);
  }
};

app.init();