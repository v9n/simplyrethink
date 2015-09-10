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
    this.subscribe(msg.from.id)
  }.bind(this))
}

// Subscribe an user into alert system
Bot.prototype.subscribe = function(chatId) {
  this.subscribers.push(chatId)
  this.bot.sendMessage(chatId, "You has been subscribed to monitoring boot. We will notifiy you when a service is down or slow")
  this.emit('subscribe', chatId)
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

