var expect = require('chai').expect
    , should = require('chai').should()
    , assert = require("assert")
    , sinon = require('sinon')
    , Bot = require('../bot')

    , TelegramBot = require('node-telegram-bot-api')

describe('Bot', function() {

  this.timeout(10000)
  var bot

  sinon.stub(TelegramBot.prototype, 'sendMessage')

  it('accept two params', function() {
    bot = new Bot('token', [{id: 1}, {id: 2}])
    expect(bot).to.be.an.instanceOf(Bot)
  })

  describe('#subscribe', function() {
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
})
