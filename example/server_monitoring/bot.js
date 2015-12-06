var events = require('events')
    , em = new events.EventEmitter

exports = module.exports = Bot

var TelegramBot = require('node-telegram-bot-api')

function Bot(token, subscribers) {
  this._token = token
  this.bot    = new TelegramBot(token, {polling: true})
  if (typeof subscribers == 'undefined') {
    this.subscribers = []
  } else {
    this.subscribers = subscribers
    console.log("** bot: pre-defined subscribers ", this.subscribers)
  }
  events.EventEmitter.call(this);
}

Bot.prototype.__proto__ = events.EventEmitter.prototype

Bot.prototype.watch = function() {
  console.log("** Watch telegram", this._token)
  this.bot.on('text', function(msg) {
    console.log("** Get telegram message")
    console.log(msg)
    console.log("\n\n")

    this.subscribe(msg.from)
  }.bind(this))
}

// Subscribe an user into alert system
Bot.prototype.subscribe = function(from) {
  this.subscribers.push(from)
  this.bot.sendMessage(from, "Now, you have to insert your chatid into website table " + from.id)
    .then(function(result){
      console.log("Succesful to notify via telegram")
    }, function(err){
      console.log("Fail to send message to telegram")
      console.log(err)
    })
  //@TODO
  //Support syntax subscribe website and insert automatically
  //this.bot.sendMessage(chatId, "You has been subscribed to monitoring boot. We will notifiy you when a service is down or slow. Btw, you can use this chatId " + chatId)
  this.emit('subscribe', from)
}

// Broadcast a message to all subscribers
Bot.prototype.yell = function(msg) {
  this.subscribers.forEach(function(index, value) {
    var chatId = index
    if (typeof index == 'object') {
      chatId = index.id
    }
    this.bot.sendMessage(chatId, msg)
  }.bind(this))
}

Bot.prototype.yellTo = function(msg, to) {
  this.bot.sendMessage(to.id, msg)
}
