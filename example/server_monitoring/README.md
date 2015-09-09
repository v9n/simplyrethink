# Server monitoring

A simple NodeJS programmer to monitor your website with data back on
RethinkDB.

# What it does

- Monitor a list of website that is stored in `website` table
- Send a normal GET request, if the response time is greater than a
  threshold, or status code is different from 200, an alert is sent to
  your telegram account

# How to use

- Manually insert a list of website into `website` table
- Register a bot on Telegram
- Set the Bot API token to `.env`. Reference `.env.dist` for a template
- Run `node index.js`
- Send your bot a random message so our monitoring script recognized
  your chat id. It will notify that chat id later

# Demo

# Test

Using mocha and chai. You have to have a RethinkDB listen on local.

```
mocha
```
