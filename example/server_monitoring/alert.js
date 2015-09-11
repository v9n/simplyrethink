exports = module.exports = Alert

function Alert(storage, notifier) {
  this._storage = storage
  this._notifier   = notifier
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
  console.log(checkResult)
  if (checkResult.duration > threshold) {
    console.log(checkResult.website.uri, " takes more than ", threshold," to respond ", checkResult.duration, ". Alert needed")
    this._notifier.yell(checkResult.website.uri + " takes more than "+ threshold+"ms to respond: "+ checkResult.duration)
  }

  if (checkResult.statusCode != 200) {
    console.log(checkResult.website.uri, " returns code ", checkResult.statusCode,". Alert needed")
    this._notifier.yell(checkResult.website.uri + " returns code"+ checkResult.statusCode+"ms to respond: " + checkResult.duration)
  }
}
