# Yelp example

Yelp has their dataset available on
[https://www.yelp.com/dataset_challenge/dataset](https://www.yelp.com/dataset_challenge/dataset)

After downloading, we have data in JSON format which makes it easier to
import to RethinkDB.

One note is we will change primary key of some table to match what we
have in JSON file wihtout any extra processing

# Init database


```
r.dbCreate('y')

r.db('y').tableCreate('business', {
  primaryKey: 'business_id'
})
rethinkdb import -f yelp_academic_dataset_business.json --table y.business --force

r.db('y').tableCreate('checkin', {})
rethinkdb import -f yelp_academic_dataset_checkin.json --table y.checkin --force

r.db('y').tableCreate('review', {
  primaryKey: 'review_id'
})
rethinkdb import -f yelp_academic_dataset_review.json --table y.review --force

r.db('y').tableCreate('tip', { })
rethinkdb import -f yelp_academic_dataset_tip.json --table y.tip --force

r.db('y').tableCreate('user', {
  primaryKey: 'user_id'
})
rethinkdb import -f yelp_academic_dataset_user.json --table y.user --force
```

# Analyze data

After having data, time to analyze our data.

### Find the most popular username

```
r.db('y').table('user').indexCreate('name')
r.db('y').table('user')
  .group('name', {index: 'name'})
```

### Find day with most reviews

### Day of month

### Day of week

### Month with most reviews

### Which hours has most reviews
