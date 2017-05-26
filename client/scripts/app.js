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
  clearMessages: function() {},
  renderMessage: function(message) {
    
    $("#chats").append(message);
  },
  renderRoom: function() {}
};