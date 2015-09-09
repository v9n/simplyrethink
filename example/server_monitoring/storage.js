var async = require('async')
  , r   = require('rethinkdb')
  , Promise = require("bluebird")

exports = module.exports = Storage 

function Storage(options) {
  this._db = options.db
  this._connection = null
}

Storage.prototype.getService = function() {
  var self = this
  return new Promise(function (resolve, reject) {
    r.table('website')
      .run(self._connection, function(err, cursor) {
        if (err) {
          console.log("** Error when fetching service", err)
          reject(err)
          return
        }

        resolve(cursor.toArray())
      })
  })
}

Storage.prototype.report = function(doc) {
  var self = this
  return new Promise(function(resolve, reject) {
    r.table('monitor').insert(doc)
      .run(self._connection, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

Storage.prototype.init = function() {
  var self = this
  return new Promise(function(resolve, reject) {
    r.connect({db: self._db})
      .then(function (c) {
        console.log("** Successful to connect to RethinkDB")
        self._connection = c
        return self
      })
      .error(function(error) {
        console.log("** Fail to initialize storage ", error)
        reject(error)
      }).then(function(){
        console.log("** Finish initalize storage")
        resolve(self)
      })
  })
}
