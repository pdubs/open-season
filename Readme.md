Open Season

A strava segment analysis tool to determine the average (and peak) "season" for the greatest* high country mountain biking descents.

---

Structure

sample_knex_migration.js - sample knex mysql migration

app.js - Node server:

	1) Pulls Segment and Leaderboard data from the strava API, and then populates the mysql database `strava` with two tables (Segments and Efforts).

	2) Hosts server at localhost:3000 with the API endpoints:
		"/" - default endpoint renders public/index.html
		"/segments" - getSegments endpoint provides all Segments records
		"/efforts/:id" - getEffortsBySegmentStravaId endpoint provides all efforts by strava segment ID

public/script.js - AngularJS app:

	1) Pulls Segments and Efforts per segment from API
	2) Prepares Segments and Efforts $scope data for data table
	3) Processes efforts per segment into efforts per month data for highcharts bar chart

public/index.html - Default 

---

Motivation

Strava's existence may be spurring an increase in reckless riding, but it also provides a large pool of open data.  A good idea to istoric segment/leaderboard data could be used to determine when the best time to travel to specific destinations is on average, by factoring in the normal "open season".

Inspired by the days spent outrunning freak high country snow storms on epic descents.

---

Installation

Install mysql (14.14+ for osx), node (7.3.0+) & npm(5.6.0+).
`npm install`
`knex migrate:make segments_efforts`
Open `migrations/XXXX_segments_efforts.js` and `sample_knex_migration.js` in a text editor
Copy contents of `sample_knex_migration.js` into `migrations/XXXX_segments_efforts.js`, Save
`knex migrate:latest`
`node app.js`

To drop each table and start fresh, you'll need to:
`knex migrate:rollback`
`knex migrate:latest`



*I may be biased

