var expect = require('chai').expect
    , assert = require("assert")
    , Alert = require('../alert')
    , r   = require('rethinkdb')
    , uuid = require('node-uuid')
    , sinon = require('sinon')

describe('Alert', function() {
  var testDbName = 'testa'
  var connection
  this.timeout(10000)

  // Man, this is called callback hell, right? but what is the quickest way to setup this
  before(function(done) {
    r.connect().then(function(c) {
        r.dbCreate(testDbName).run(c, function(result) {
          connection = c
          r.db(testDbName).tableCreate('monitor').run(c, function(result) {
          })

          r.db(testDbName).tableCreate('website').run(c, function(result) {
            r.db(testDbName).table('website')
              .insert({id: 1, uri: 'http://axcoto.com'})
              .run(c, function(result) {
                setTimeout(done, 1000)
              })
          })
          c.use(testDbName)
        })
      })
  })

  after(function(done) {
    r.dbDrop(testDbName).run(connection, function(result) {
      done()
    })
  })

  it('accept two argument', function() {
    var alert = new Alert({connection: "foo", db: "db"}, "bar")
    expect(alert).instanceof(Alert)
  })

  describe('watches', function() {
    it('listen to change feed', function(done) {
      connection.use(testDbName)
      var alert = new Alert({connection: connection, db: testDbName}, "bar")
      sinon.stub(alert, 'inspect')

      alert.watch()
      r.db(testDbName).table('monitor').insert({website_id: 1, duration: 1000}, {durability: 'soft'}).run(connection, function(result) {
        setTimeout(function() {
          assert(alert.inspect.called)
          done()
        }, 800)
      })
    })
  })

  describe('inspects', function() {
    it('notify if the status is diffferent', function() {
      console.log("...")
    })

    it('notify if the duration us longer than threshold', function() {
      console.log("inspect")
    })
  })

})
