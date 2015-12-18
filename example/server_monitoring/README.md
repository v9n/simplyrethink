# Server monitoring

A simple NodeJS programmer to monitor your website with data back on
RethinkDB.

# Demo

See https://www.youtube.com/watch?v=XINum9pOiOg&feature=youtu.be

# Running with docker

```shell
$ sudo docker run --restart=always -d -v `pwd`/data:/data/rethinkdb -v
  `pwd`/log:/var/log/monitor -p 8080:8080 \
  -e "TELEGRAM_BOT_API=your telegram api" \
  -e "TWILIO_ACCOUNT_SID=twilio_account_sid" \
  -e "TWILIO_AUTH_TOKEN=twilio_auth_token" \
  -e "TWILIO_FROM=+1xxxxxxxxx" \
  simplyrethinkdb/monitor:0.1.1
```

Then visit `hostip:8080` to open Dashboard and insert website data

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

# Setup

### 1. Create database

```
r.dbCreate('webmon')
r.db('webmon).tableCreate('website')
r.db('webmon).tableCreate('subscriber')
r.db('webmon).tableCreate('monitor')
r.db('webmon).tableCreate('incident')
r.db('webmon').table('incident').indexCreate('website_id')
r.db('webmon').table('incident').indexCreate('open_incident', [r.row('status'), r.row('website_id')])
```

### 2. Create a bot in telegram 

Follow https://core.telegram.org/bots/api

Once you get the API, create file `.env`:

```
TELEGRAM_BOT_API=API_KEY
```

### 3. Insert your website to monitoring

Example, I want to monitor `www.axcoto.com`

```
r.db('webmon').table('website').insert([
  {
    "id": 1 ,
    "threshold": 1500 ,
    "uri": "https://www.axcoto.com",
  },
  {
    "id": 3 ,
    "threshold": 1500 ,
    "uri": "https://leanpub.com/simplyrethinkdb",
  },
  ])
```

### 4. Run 

```
node index.js
```

### 5. Subscribe

Send your bot any message so that the NodeJS can fetch it and find your chat id (user_id)
it will notify you whenever a site takes long than threshold to respond

## Schema

* `website`
    - `id`
    - `uri`
    - `threshold`: milliseconds of response time
* `subscriber`
    - `id`: telegram chat id
    - `name`
* `monitor`
    - `website_id`
    - `id`: check id
    - `duration`: latency
    - `statusCode`: response

# Help wanted

Lots of thing can be improved

 * Add new site via telegram
 * Query status via telegram
 * Custom condition for each website
 * Different output plugin: mail, hipchat,...

# Test

Using mocha and chai. You have to have a RethinkDB listen on local.

```
mocha
```
