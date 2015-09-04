var async = require('async')
  , r   = require('rethinkdb')
  , Promise = require("bluebird")
  , Check = require('./check')
  , Alert = require('./alert')

r.connect({db: "webmon"}).then(function (c) {
  run(c)
  alert = new Alert(c)
  alert.watch()
  //createData(c)
}).error(function(error) {
  console.log(error)
}).then(function(){
  console.log("** Finish initalize. Start monitoring")
})

var getConnection = function() {
  return connection
}

var listDb = function(c) {
  r.dbList().run(c, function(error, data) {
    console.log(data)
  })

  r.tableList().run(c, function(error, data) {
    console.log(data)
  })
}

var createData = function(connection) {
  r.table('website').insert([
    {id: 1, uri: 'http://axcoto.com'},
    {id: 2, uri: 'http://blog.noty.im'}
  ]).run(connection)
}

var run = function(connection) {
  r.table('website').run(connection, function(err, cursor) {
    if (err) {
      console.log(err)
      return
    }

    check = new Check()
    cursor.each(function(err, row) {
      if (err) {
        console.log("Get error when fetching " + err)
      } else {
        monitor(connection, check, row)
      }
    })
  })
}

var monitor = function(connection, check, row) {
  //console.log("** Start to check ", row)
  check.http(row.uri)
    .then(function(data) {
      report(connection, row, data)
        .catch(function(error) {
          console.log("Fail to write data")
          console.log(error)
        })
    })
    .then(function(data) {
      setTimeout(function() {
        monitor(connection, check, row)
      }, 3000)
    })
    .catch(function(error) {
      console.log(error)
    })
}

var report = function(connection, row, data) {
  return new Promise(function(resolve, reject) {
    r.db('webmon').table('monitor').insert({
      website_id: row.id,
      duration: data.meta.duration
    }).run(connection, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
