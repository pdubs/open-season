# Open Season

#### A strava segment analysis tool to determine the average (and peak) "season" for the greatest* high country mountain biking descents.

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

I've often wondered if looking at historic Strava segment data could help determine the best time to travel to specific destinations - because places like Moab, Crested Butte, and Teton Pass are not easily accessed!

For segments that get enough traffic, we could even look at the fastest times ever to determine a minimum elapsed "competitive" time (which could help indicate when a trail is dry enough to ride in the Spring).

This app was ultimately inspired by the days spent outrunning freak high country snow storms.

---

### Installation

1. Install *mysql* (14.14+ for osx), *node* (7.3.0+) & *npm* (5.6.0+).
2. `npm install`
3. `knex migrate:make segments_efforts`
4. Open `migrations/XXXX_segments_efforts.js` and `sample_knex_migration.js` in a text editor
5. Copy contents of `sample_knex_migration.js` into `migrations/XXXX_segments_efforts.js`, Save
6. `knex migrate:latest`
7. `node app.js`

To drop each table and start fresh, you'll need to:
`knex migrate:rollback`
`knex migrate:latest`

---

*I may be biased

