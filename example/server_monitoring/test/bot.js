var expect = require('chai').expect
    , should = require('chai').should()
    , assert = require("assert")
    , sinon = require('sinon')
    , Bot = require('../bot')

    , TelegramBot = require('node-telegram-bot-api')

describe('Bot', function() {

  this.timeout(10000)
  sinon.stub(TelegramBot.prototype, 'sendMessage')

  it('accept two params', function() {
    var bot = new Bot('token', [{id: 1}, {id: 2}])
    expect(bot).to.be.an.instanceOf(Bot)
  })

  describe('#watch', function() {
    var source = {from: {id: 3}}
    it('registers subscriber when receiving text message', function(done) {
      var bot = new Bot('token', [{id: 1}, {id: 2}])
      sinon.stub(bot, 'subscribe',function(msg) {
        expect(msg).to.be.equal(source.from)
        done()
      })
      bot.watch()
      bot.bot.emit('text', source)
    })
  })

  describe('#subscribe', function() {
    var bot = new Bot('token', [{id: 1}, {id: 2}])
    it('send message to the subscriber', function() {
      bot.subscribe(1)
      assert(TelegramBot.prototype.sendMessage.called)
    })

    it('emit event', function(done) {
      bot.on('subscribe', function(id) {
        expect(id).to.equal(1)
        done()
      })
      bot.subscribe(1)
    })
  })

  describe('#yell', function() {
    var bot = new Bot('token', [{id: 1}, {id: 2}])
    it('send message to the subscribers', function() {
      bot.yell('lol')
      assert(TelegramBot.prototype.sendMessage.calledWith(1, 'lol'))
      assert(TelegramBot.prototype.sendMessage.calledWith(2, 'lol'))
    })
  })
})
