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
  bot = new Bot(process.env.TELEGRAM_BOT_API)
  alert = new Alert({connection: c, db: "webmon"}, bot)
  alert.watch()
  bot.watch()
  bot.on('subscribe', function(chatId) {
    console.log("Event with id ", chatId)
    r.table('subscriber')
    .insert({id: chatId})
    .run(c)
    .then(function(result) {
      console.log("Insert subscriber and their chat id")
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
    }, 3000)
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
