var expect = require('chai').expect
  , assert = require("assert")
  , Alert = require('../alert')
  , r   = require('rethinkdb')
  , uuid = require('node-uuid')
  , sinon = require('sinon')
  , Storage = require('../storage')

describe('Alert', function() {
  var testDbName = 'testa'
  var connection
  this.timeout(10000)

  it('accept two argument', function() {
    var alert = new Alert("storage", "bar")
    expect(alert).instanceof(Alert)
  })

  describe('watches', function() {
    it('listen to change feed', function() {
      var storage = new Storage({db: 'db'})
      sinon.stub(storage, 'watch')
      var alert = new Alert(storage, "bar")
      sinon.stub(alert, 'inspect')
      alert.watch()
      storage.emit('alertChange', {alert: 'message'})
      assert(storage.watch.calledOnce)
      assert(alert.inspect.calledWith({alert: 'message'}))
    })
  })

  describe('inspects', function() {
    var notifier = {yell: function(msg) {}}
    sinon.stub(notifier, 'yell')
    var alert = new Alert("storage", notifier)

    it('notify if the status is diffferent', function() {
      alert.inspect({ duration: 680,
                    id: '1d381894-71ef-42e7-94a9-8557c5f7feff',
                    statusCode: 400,
                    website: { id: 3, uri: 'https://www.foo.com' },
                    website_id: 3 })
                    assert(notifier.yell.called)
    })

    it('notify if the duration us longer than threshold', function() {
      alert.inspect({ duration: 1680,
                    id: '1d381894-71ef-42e7-94a9-8557c5f7feff',
                    statusCode: 400,
                    website: { id: 3, uri: 'https://www.foo.com' },
                    website_id: 3 })
                    assert(notifier.yell.called)
    })
  })

})
