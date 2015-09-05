exports = module.exports = Bot

var TelegramBot = require('node-telegram-bot-api')

function Bot(token) {
  this._token = token
  this.bot    = new TelegramBot(token, {polling: true})
}

Bot.prototype.watch = function() {
  console.log("** Watch telegram", this._token)
  this.bot.on('text', function(msg) {
    console.log(msg)
  })
}

// Subscribe an user into alert system
Bot.prototype.subscribe = function(chat_id) {

}

