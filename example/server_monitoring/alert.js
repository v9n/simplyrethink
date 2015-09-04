var
r   = require('rethinkdb')

exports = module.exports = Alert

function Alert(storage, notifier) {
  if (typeof storage.connection == 'undefined') {
    throw "Define connection"
  }
  if (typeof storage.connection == 'undefined') {
    throw "Define db"
  }

  this._connection = storage.connection
  this._db         = storage.db
  this._notifier   = notifier
}

Alert.prototype.watch = function() {
  self = this
  r.table('monitor')
  .changes()
  ('new_val')
  .merge(function(doc) {
    return {
      website: r.db(self._db).table('website').get(doc('website_id')).default({})
    }
  })
  .run(this._connection, function(err, cursor) {
    if (err) {
      console.log(err)
    }

    if (typeof cursor == 'undefined') {
      return
    }

    cursor.each(function(err, row) {
      console.log(err)
      console.log("get row", row)
      self.inspect(row)
    })
  })
}

/**
 * Inspect a check result to see if we need alerting 
 */
Alert.prototype.inspect = function(check_result) {
  if (check_result.duration > 100) {
    console.log(check_result.website.uri, " takes more than 100ms to respon ", check_result.duration, ". Alert needed")
  }
}
