var accountSid = process.env.TWILIO_ACCOUNT_SID
var authToken  = process.env.TWILIO_AUTH_TOKEN
var from       = process.env.TWILIO_FROM

var client = require('twilio')

function Bot(option) {
  this._option = option
  this.bot    = client(accountSid, authToken)
}

// Broadcast a message to all subscribers
Bot.prototype.yell = function(msg) {
  console.log('Will notify twilio sms', msg)
  var token = this._option.token
  this.bot.messages.create({
    body: msg,
    to: this._option.phone,
    from: from
  },function(err, message){
      if (err == null) {
        console.log('Successfully sent sms.')
        process.stdout.write(message.sid)
      } else {
        console.log("Get error when sending SMS")
        console.log(err)
      }
  })
}

Bot.prototype.getName = function() {
  return 'twilio'
}

exports = module.exports = function(option) {
  return new Bot(option)
}
