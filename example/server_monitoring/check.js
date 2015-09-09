var Promise = require("bluebird")
  , request = require('request')

exports = module.exports = Check;

function Check() {
}

/**
 * HTTP check
 *
 * Send a get request to end point, gather data about request
 */
Check.prototype.http = function(url) {
  return new Promise(function(resolve, reject){
    var start = new Date().getTime()
    request(url, function (error, response, body) {
      var end = new Date().getTime()
      if (error) {
        reject(error)
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


