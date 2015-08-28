var async = require('async')
  , r   = require('rethinkdb')
  , Promise = require("bluebird")
  , request = require('request')


r.connect({db: "webmon"}).then(function (c) {
  run(c)
  listDb(c)
}).error(function(error) {
  console.log(error)
})

var listDb = function(c) {
  r.dbList().run(c, function(error, data) {
    console.log(data)
  })

  r.tableList().run(c, function(error, data) {
    console.log(data)
  })
}

var run = function(connection) {

  monitor('http://axcoto.com')
  .then(function(data) {
    report(data, connection)
    .catch(function(error) {
      console.log("Fail to write data")
      console.log(error)
    })
  })
  .catch(function(error) {
    console.log(error)
  })

}

var monitor = function(url) {
  return new Promise(function(resolve, reject){
    var start = new Date().getTime()
    request(url, function (error, response, body) {
      var end = new Date().getTime()
      if (error) {
        reject(err)
      } else {
        resolve({
          response: response,
          meta: {
            duration: end - start
          }
        })
      }
    })
  })
}

var report = function(data, connection) {
  return new Promise(function(resolve, reject) {
    listDb(connection)
    r.db('webmon').table('monitor').insert(data).run(connection, function(err, result) {
      if (err) {
        listDb(connection)
        //reject(err)
      } else {
        listDb(connection)
        //resolve(result)
      }
    })
  })
}
