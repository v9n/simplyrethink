//var HipchatBot = require('hipchat-client');
var HipchatBot = require('hipchatter')

function Bot(option) {
  this._option = option
  this.bot    = new HipchatBot(option.token)
}

// Broadcast a message to all subscribers
Bot.prototype.yell = function(msg) {
  console.log('Will notify hipchat ', msg)
  var token = this._option.token
  this.bot.notify(this._option.room,
                    {
                      message: msg,
                      color: 'purple'
                    }, function(err){
                      if (err == null) console.log('Successfully notified the room.');
                    });
}

Bot.prototype.getName = function() {
  return 'hipchat'
}

exports = module.exports = function(option) {
  return new Bot(option)
}
