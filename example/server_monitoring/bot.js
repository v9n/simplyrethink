var events = require('events')

exports = module.exports = Bot

var TelegramBot = require('node-telegram-bot-api')

function Bot(token) {
  this._token = token
  this.bot    = new TelegramBot(token, {polling: true})
  this.subscribers = []
}

Bot.prototype.watch = function() {
  console.log("** Watch telegram", this._token)
  this.bot.on('text', function(msg) {
    this.subscribe(msg.from.id)
  }.bind(this))
}

// Subscribe an user into alert system
Bot.prototype.subscribe = function(chatId) {
  this.subscribers.push(chatId)
  this.bot.sendMessage(chatId, "Ok, I will notifiy you")
}

// Broadcast a message to all subscribers
Bot.prototype.yell = function(msg) {
  this.subscribers.forEach(function(index, value) {
    this.bot.sendMessage(index, msg)
  }.bind(this))
}

