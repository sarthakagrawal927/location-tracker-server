# Server

## DB Design

What we know:

We need to have backup of staff movement. So we will need to store the location every 5 minutes.
Reading will be relatively very less, as I plan to store the day's location data in-memory.

- If number of staff is N, then about N/5 writes every minute. Most DBs can handle this sort of load. For my personal use case N won't exceed 200 unless I plan to monetize it. In case I do decide to monetize it, I can just use redis to write data for whole day & then insertMany to DB at EOD. Should be fast enough & scalable.

- Only when occasionally wants past info, I'll query the DB.
- Reads should be very few. If reads increase we can easily add a cache layer with key (staff_id, date) and value (list of locations).
- To make the historic reads faster, we can add a partial index for all user_ids. - Insert will still be faster as each record will have to be written in just 1 table and index.

### Postgres

```sql
DROP TABLE users;
CREATE TABLE users (
    username VARCHAR(100) NOT NULL,
    phone VARCHAR(13) UNIQUE NOT NULL
);

DROP TABLE locations;
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(13) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    loc_timestamp TIMESTAMP NOT NULL
);

INSERT INTO USERS(username,phone) VALUES(
	'Sarthak',
    '1234567890'
);

--every 5minutes we will have to insert a row in table for every user.
```

We can use Redis heavily when we scale, but for now, I think Postgres will be good enough. Regarding text search, we can use Postgres' full text search feature. Elastic Search would be overkill as N won't be too high that Postgres can't handle. Spatial databases are not needed as we don't need to do any geo-spatial queries.

## Realtime
Every 5seconds all N users will be sending their coordinates which are to be send to the web client & occasionally store them in-memory/DB. We can use message queues, but as these are built on sockets & we don't need the extra functionalities they provide, we can just use sockets.

We need store minute wise location in Database, so every 60s, N insertions will be made to the database.

Since we won't be modifying the location once written, we can use Elastic Search with time based index. Once it scales doing that will make more sense.

While storing to ensure the main thread isn't blocked we can avoid using await or use some sort of worker thread.