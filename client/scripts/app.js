var app = {
  
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

  messages: [],

  init: function() {
    this.fetch();
    var boundRender = this.renderRoom.bind(this);
    setTimeout( boundRender(this.messages), 2000);

    this.update();
  },

  send: function() {
    var message = {};
    var textBox = document.getElementById('messageText');
    var roomSelect = document.getElementById('roomSelect');

    message.username = window.location.search.replace('?username=', '');
    message.roomname = roomSelect.value;
    message.text = textBox.value;
    textBox.value = '';

    this.renderRoom(this.messages);

    $.ajax({
      type: 'POST',
      url: this.server,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(message) {
        console.log('chatterbox: Message sent', message);
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
    this.messages.unshift(message);
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
    var roomSelect = document.getElementById('roomSelect');
    var currentSelection = roomSelect.value;

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

    roomSelect.value = currentSelection;
  },

  update: function() {
    console.log('update called');

    var renderMessage = this.renderMessage;

    this.clearMessages();
    // These next 2 lines filter the messages by current room:
    var roomSelect = document.getElementById('roomSelect');
    var selectedRoom = roomSelect.value;
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