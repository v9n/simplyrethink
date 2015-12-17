exports = module.exports = Alert

function Alert(storage, notifier) {
  this._storage = storage
  this._adapters = {}

  if (typeof notifier == 'object' && typeof notifier[0] != 'undefined') {
    this._notifier   = notifier
  } else {
    this._notifier   = [notifier]
  }

  this._adapters['telegram'] = notifier
  this._adapters['hipchat'] = require('./notifier/hipchat')
  this._adapters['twilio'] = require('./notifier/twilio')
}

Alert.prototype.subscribe = function(notifier) {
  this._notifier.push(notifier)
}

Alert.prototype.watch = function() {
  var self = this
  this._storage.watch()
  this._storage.on('alertChange', function(alert) {
      console.log("get row", alert)
      self.inspect(alert)
  })
}

/**
 * Inspect a check result to see if we need alerting 
 */
Alert.prototype.inspect = function(checkResult) {
  var threshold = checkResult.website.threshold || 1000
      , message = ''
      , alertNeeded = false

  console.log(checkResult)
  if (checkResult.duration > threshold) {
    console.log(checkResult.website.uri, " takes more than ", threshold," to respond ", checkResult.duration, ". Alert needed")
    message = checkResult.website.uri + " takes more than "+ threshold+"ms to respond: "+ checkResult.duration
    alertNeeded = true
  }

  if (checkResult.statusCode != 200) {
    console.log(checkResult.website.uri, " returns code ", checkResult.statusCode,". Alert needed")
    message = checkResult.website.uri + " returns code"+ checkResult.statusCode+"ms to respond: " + checkResult.duration
    alertNeeded = true
  }

  if (!alertNeeded) {
    if (checkResult.hasIncident) {
      console.log("Close incident")
    }
    return
  }

  if (!checkResult.hasIncident) {
      this._storage.createIncident(checkResult.website.id, {
          message: message,
          monitor_id: checkResult.id
      })

      console.log(this._notifier)
      var self = this
      var telegram = this._notifier[0];
      checkResult.website.subscribers.forEach(function(subscriber) {
        // Telegram is special, we will send notification use bot object
        if ('telegram' == subscriber.name) {
          console.log("** Will notify telegram")
          self._adapters['telegram'].yellTo(message, subscriber.option)
          return
        }

        var noti = self._adapters[subscriber.name](subscriber.option)
        noti.yell(message)
      }.bind(this))
  }
}
