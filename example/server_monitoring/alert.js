exports = module.exports = Alert

function Alert(storage, notifier) {
  this._storage = storage
  if (typeof notifier == 'object' && typeof notifier[0] != 'undefined') {
    this._notifier   = notifier
  } else {
    this._notifier   = [notifier]
  }
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
  var message

  console.log(checkResult)
  if (checkResult.duration > threshold) {
    console.log(checkResult.website.uri, " takes more than ", threshold," to respond ", checkResult.duration, ". Alert needed")
    message = checkResult.website.uri + " takes more than "+ threshold+"ms to respond: "+ checkResult.duration
  }

  if (checkResult.statusCode != 200) {
    console.log(checkResult.website.uri, " returns code ", checkResult.statusCode,". Alert needed")
    message = checkResult.website.uri + " returns code"+ checkResult.statusCode+"ms to respond: " + checkResult.duration
  }

  if (typeof checkResult.website.subscribers == 'undefined') {
    this._notifier.forEach(function(notifier) {
      notifier.yell(message)
    }.bind(this))
  } else {
    checkResult.website.subscribers.forEach(function(subscriber) {
      var noti =  require('./notifier/' + subscriber.name)(subscriber.option)
      noti.yell(message)
    })
  }

}
