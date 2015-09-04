var expect = require('chai').expect
    , assert = require("assert")
    , Check = require('../check')
    , sinon = require('sinon')

describe('Check', function() {
  var check = new Check()
  this.timeout(10000)

  describe('http', function() {
    it('gather response of an url', function(done) {
      check.http('https://www.fpcomplete.com/')
        .then(function(data) {
          expect(data.meta.duration > 1).to.equal(true)
          done()
        })
        .error(function(err) {
          console.log(err)
          done()
        })
    })
  })
})
