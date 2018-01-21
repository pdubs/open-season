# Open Season

#### A strava segment analysis tool to determine the average and peak season for epic mountain biking descents.

---

### Structure

sample_knex_migration.js - sample knex mysql migration

app.js - Node server:

1) Pulls Segment and Leaderboard data from the strava API, and then populates the mysql database `strava` with two tables (Segments and Efforts).

2) Hosts server at localhost:3000 with the API endpoints:

```
"/" - default endpoint renders public/index.html
"/segments" - getSegments endpoint provides all Segments records
"/efforts/:id" - getEffortsBySegmentStravaId endpoint provides all efforts by strava segment ID
```

public/script.js - AngularJS app:

1) Pulls Segments and Efforts per segment from API
2) Prepares Segments and Efforts $scope data for data table
3) Processes efforts per segment into efforts per month data for highcharts bar chart

---

### Motivation

Looking at historical strava segment data and comparing it to current rider and weather trends will allow us to determine the best time to plan travel to specific destinations.

Popular destination trails are perfect candidates for this analysis, for example:

- [Burro](https://www.strava.com/segments/1218626) (Moab, UT)
- [Doctor Park](https://www.strava.com/segments/2474266) (Crested Butte, CO)
- [Lithium](https://www.strava.com/segments/7648857) (Teton Pass, WY)

These destinations are not easily accessible, and often require significant weather and trail condition research.

The next step is to compare the fastest attempts to the average attempts to determine the minimum elapsed time to consider a trail "open" - this minimum time, compared to the fastest attempts lately and the recent weather, will help us predict when a high country trail is dry enough to ride.

---

### Installation (osx)

1. Install *mysql* (14.14+), *node* (7.3.0+) & *npm* (5.6.0+).
2. Run `npm install` to install the npm dependencies (from package.json)
3. Run `knex migrate:make segments_efforts` to have knex create a new db migration
4. Copy the contents of `sample_knex_migration.js` into the migration file created by step 3. inside of the `migrations/` folder
5. Run `knex migrate:latest` to initialize the mysql db
6. Run `node app.js`

The app should now be running at http://localhost:3000/

---

### FAQ

Start the API server with current data:

1. Ensure `updateDb` is `false` in `app.js`
2. Run `node app.js`

Reload the database and start the API server:

1. Run `knex migrate:rollback`
2. Run `knex migrate:latest`
3. Ensure `updateDb` is `true` in `app.js`
4. Run `node app.js`

---

### References

http://knexjs.org/
http://expressjs.com/
http://bluebirdjs.com/
https://github.com/request/request-promise
https://www.highcharts.com/




