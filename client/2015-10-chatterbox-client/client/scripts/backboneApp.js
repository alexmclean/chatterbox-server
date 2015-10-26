/*
var App = Backbone.Model.extend({
  initialize: function(){

  }

});
*/
var Chat = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',

  defaults: {
    username: '',
    text: '',
    roomName: 'All Rooms'
  },

  //isn't called :(
  addFriend: function(){
    console.log("added a friend!");
  }
});

var Chats = Backbone.Collection.extend({
  model: Chat,
  url: 'https://api.parse.com/1/classes/chatterbox',

  initialize: function(){
    //doesnt belong here
    this.getMessages();
  },

  getMessages: function(){
    console.log("getting more chats...");
    this.fetch({data: {order: '-createdAt'}});
  },
  parse: function(response, options){
    return response.results;
  }
});

//CHATVIEW
var ChatView = Backbone.View.extend({

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                          <div class="username"><%- username %></div> \
                          <div class="text"><%- text %></div> \
                        </div>'),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  },
  addFriend: function(){
    console.log("added a friend!");
  },
  events: {'click .username': 'addFriend'}

});


var ChatsView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.render, this);
    this.onScreen = {};
  },

  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(chat){
    if(!this.onScreen[chat.get('objectId')]){
      var chatView = new ChatView({model: chat});
      this.$el.prepend(chatView.render());
      this.onScreen[chat.get('objectId')] = true;
    }
  },

});

var FormView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'click #send': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.startSpinner();
    console.log(this.collection);
    var $text = this.$('#message');
    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val()
    });
    console.log(this.collection);
    $text.val('');
  },

  startSpinner: function() {
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});
/*
var chat = new Chat('Alex', 'he says hi', 'MyRoom');
var chat2 = new Chat('Alext', 'he says hih', 'MyRoom');
var chat3 = new Chat('Alexa', 'he says hig', 'MyRoom');
var chatList = [chat, chat2, chat3];
var chatColl = new Chats(chatList);

var chatsview = new ChatsView({collection : chatColl});

$('body').append(chatsview.render());
*/