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
Alert.prototype.inspect = function(check_result) {
  if (check_result.duration > 200) {
    console.log(check_result.website.uri, " takes more than 100ms to respon ", check_result.duration, ". Alert needed")
    this._notifier.yell(check_result.website.uri + " takes more than 100ms to respon " + check_result.duration)
  }
}
