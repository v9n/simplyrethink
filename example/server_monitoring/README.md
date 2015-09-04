# Server monitoring

This includes 2 components:

* agent: a go lang daemon that run and get cpu, memory, disk io, then
  push into RethinkDB

* server: using changefeeds, detect whenever any metrics goes over a
  threshold and notify user via a hipchat message

# Test

Using mocha and chai. You have to have a RethinkDB listen on local.

```
mocha
```
