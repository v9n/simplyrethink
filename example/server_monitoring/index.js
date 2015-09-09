var async = require('async')
  , r   = require('rethinkdb')
  , Promise = require("bluebird")
  , Check = require('./check')
  , Alert = require('./alert')
  , Bot = require('./bot')
  , Storage = require('./storage')

require('dotenv').load()

var storage = new Storage({db: 'webmon'})
storage.init().then(function(s) {
  run(s)
  //Kick off alerting system
  s.getSubscribers().then(function(subscribers) {
    bot = new Bot(process.env.TELEGRAM_BOT_API, subscribers)
    alert = new Alert(storage, bot)
    alert.watch()
    bot.watch()
    bot.on('subscribe', function(chatId) {
      console.log("Event with id ", chatId)
      s.subscribe(chatId)
    })
  })
})
.error(function(error) {
  console.log("Exit")
  process.exit(1)
})

var run = function(storage) {
  storage
  .getService()
  .then(function(services) {
    services.forEach(function(service) {
      console.log(service)
      check = new Check()
      monitor(storage, check, service)
    })
  })
  .catch(function(err) {
    console.log(err)
  })
}

var monitor = function(storage, check, row) {
  console.log("** Start to check ", row, " at ", new Date().getTime())
  check.http(row.uri)
  .then(function(data) {
    console.log(data.meta)
    report(storage, data, row)
  })
  .then(function(data) {
    setTimeout(function() {
      monitor(storage, check, row)
    }, 7000)
  })
  .catch(function(error) {
    console.log(error)
  })
}

var report = function(storage, result, check) {
  storage
  .report({
    website_id: check.id,
    duration: result.meta.duration
  })
  .then(function(result) {
  })
  .catch(function(error) {
    console.log(error)
    console.log("Fail to write data")
    console.log(error)
  })
}
