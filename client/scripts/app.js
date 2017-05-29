var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  lastMessageId: 0,
  username: 'anonymous',
  roomname: 'lobby',
  roomList: {},
  friends: [],

  init: function() {
    app.startSpinner();
    app.username = window.location.search.substr(10);
    
    // jQuery selector caching
    app.$chats = $('#chats');
    app.$username = $('.username');
    app.$send = $('#send');
    app.$message = $('#message');
    app.$roomSelect = $('#roomSelect');

    // create listeners
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);
    app.$chats.on('click', '.username', app.handleUsernameClick);

    // get data from server and render all messages
    app.fetch();

    // poll for new messages
    setInterval(function() { app.fetch(); }, 3000);
  },

  handleUsernameClick: function(event) {
    var username = $(event.target).data('username');

    if (username !== undefined) {
      app.friends[username] = !app.friends[username];

      var selector = '[data-username="' + username.replace(/"/g, '\\\"' + '"]');
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleSubmit: function(event) {

    var message = {
      username: app.username,
      text: app.escapeHTML(app.$message.val()),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);
    event.preventDefault();

  },

  handleRoomChange: function(event) {
    var selectedIndex = app.$roomSelect.prop('selectedIndex');

    if (selectedIndex === 0) {
      // create a new room
      var roomname = prompt('Please enter a new room name');

      if (roomname) {
        app.roomname = roomname;
        app.renderRoom(roomname);
        app.$roomSelect.val(roomname);
      }
    } else {
      // select a new room
      app.roomname = app.$roomSelect.val();
    }

    app.renderMessages(app.messages);
    event.preventDefault();
  },

  send: function(message) {
    app.startSpinner();

    $.ajax({
      type: 'POST',
      url: app.server,
      data: JSON.stringify(message),
      contentType: 'application/JSON',
      success: function() {
        console.dir('chatterbox: send successful');
        app.$message.val('');
        app.fetch();
      },

      error: function(error) {
        console.error('chatterbox: failed to send message', error);
      } 
    });
  },

  fetch: function() {
    $.ajax({
      type: 'GET',
      url: app.server,
      data: {order: '-createdAt'},
      success: function(data) {
        console.log('chatterbox: receive successful');
        // if no data, do nothing
        if (!data.results || !data.results.length) { return; } 

        // if there is data, update messages in storage and render
        app.messages = data.results;
        var mostRecentMessage = app.messages[app.messages.length - 1];
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          app.renderRoomList();
          app.renderMessages();
        }

        app.lastMessageId = app.messages[app.messages.length - 1].objectId;
      },
      error: function() {
        console.error('chatterbox: receive unsuccessful');
      }

    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessages: function() {
    app.clearMessages();

    app.messages.filter(function(message) {
      if (app.roomname === 'lobby' && !message.roomname) {
        return true;
      } else if (message.roomname === app.roomname) {
        return true;
      } else {
        return false;
      }
    }).forEach(app.renderMessage);

    app.stopSpinner();
  },

  renderMessage: function(message) {
    var $chat = $('<div class="chat"/>');

    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-username', message.username).appendTo($chat);

    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    app.$chats.append($chat);
  },

  renderRoom: function(roomname) {
    var $room = $('<option/>');
    $room.text(roomname);
    $room.appendTo(app.$roomSelect);
    app.roomList[roomname] = 1;
  },

  renderRoomList: function() {
    app.$roomSelect.html('<option value="_newRoom">New room...</option>');
    app.roomList = {};
    app.messages.forEach((message) => {
      if (!app.roomList[message.roomname] && message.roomname) {
        app.renderRoom(message.roomname);
      }
    });

    app.$roomSelect.val(app.roomname);
  },

  escapeHTML: function(string) {
    if (!string) {
      return;
    }
    string.replace('alert', '');
    return string.replace(/[&<>"'=\/]/g, '');
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type="submit"]').attr('disabled', true);
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type="submit"]').attr('disabled', null);
  }

};