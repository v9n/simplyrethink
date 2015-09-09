exports = module.exports = Notifier

function Notifier(website, message) {
  this._website = website
  this._message = message
}

Notifier.prototype.hipchat = function() {
}

Notifier.prototype.mail = function() {
}

Notifier.prototype.phone = function() {
}

Notifier.prototype.telegram = function() {
}



