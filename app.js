var knex = require('knex')(require('./knexfile'))
var request = require('request')
var rp = require('request-promise')
var express = require('express')
var bodyParser = require('body-parser')
var Promise = require('bluebird')
var emojiStrip = require('emoji-strip')
var mysql = require('mysql')
var db = mysql.createConnection('mysql://root@127.0.0.1:3306/strava?charset=utf8mb4')

var app = express()
var router = express.Router()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(router)

var segmentIds = []
var segmentRequests = []
var leaderboardRequests = []

var stravaApiKey = ' Bearer f8fc8a4695aeed77af60d1a3ee28d90b0668a286'
var getSegmentUrl = 'https://www.strava.com/api/v3/segments/'
var topHundredEffortsUrl = '/leaderboard?page=1&per_page=200'

var updateDb = true
var segments = {
  // warren_gulch: '1535164',
  // pikes_peak: '4665001',
  // wheeler_pass: '13114973',
  greens_creek: '1658714',
  burro: '1218626',
  kennebec: '2019489',
  dr_park: '2474266',
  two_elks: '8199567',
  lithium: '7648857'
}

Object.keys(segments).forEach(function(key,i) {
  segmentIds.push(segments[key])
});

var init = function() {
  console.log(' ** FETCHING segmentIds: ', segmentIds + '\n')

  segmentIds.map(function(segmentId) {
    let segmentsRequestUrl = getSegmentUrl + segmentId
    let segmentsRequestOptions = {
      uri: segmentsRequestUrl,
      headers: {
        Authorization: stravaApiKey
      },
      resolveWithFullResponse: true
    }
    segmentRequests.push(rp(segmentsRequestOptions))
    return segmentId
  })

  Promise.all(segmentRequests)
  .spread(function () {

    for (var i=0; i<arguments.length; i++) {
      let segment = JSON.parse(arguments[i].body)

      let finalSegment = {
        name: segment.name,
        strava_id: segment.id,
        city: segment.city,
        state: segment.state,
        created_at: segment.created_at,
        effort_count: segment.effort_count,
        athlete_count: segment.athlete_count,
        distance: segment.distance,
        average_grade: segment.average_grade,
        elevation_high: segment.elevation_high,
        elevation_low: segment.elevation_low
      }
      knex('Segments').insert(finalSegment).then (function (result) {})

      let leaderboardRequestUrl = getSegmentUrl + finalSegment.strava_id + topHundredEffortsUrl
      let leaderboardRequestOptions = {
        uri: leaderboardRequestUrl,
        headers: {
          Authorization: stravaApiKey
        },
        resolveWithFullResponse: true
      }
      leaderboardRequests.push(rp(leaderboardRequestOptions))
    }
    console.log(' ** FINISHED INSERTING SEGMENTS')

    Promise.all(leaderboardRequests)
    .spread(function () {

      for (var i=0; i<arguments.length; i++) {
        let segmentId = arguments[i].request.href.split('/')[6]
        let top200 = JSON.parse(arguments[i].body)

        top200.entries.map(function (effort) {
          let newEffort = {
            athlete_name: emojiStrip(effort.athlete_name),
            elapsed_time: effort.elapsed_time,
            rank: effort.rank,
            start_date_local: effort.start_date_local,
            segment_strava_id: parseInt(segmentId)
          }
          knex('Efforts').insert(newEffort).then (function (result) {})
        })
      }
      console.log(' ** FINISHED INSERTING TOP 200 EFFORTS')

      app.listen('3000', () => {
        console.log('Server running on port 3000!')
      })

    })
    .catch(function (err) {
      console.log(" -- TOP 200 REQUEST ERROR: ",err)
    })
  })
  .catch(function (err) {
    console.log(" -- SEGMENT REQUEST ERROR: ",err)
  })
}

var Segments = {
  getSegments:function(callback){
    return db.query("SELECT * FROM Segments",callback)
  }
}

var Efforts = {
  getEffortsBySegmentStravaId:function(id,callback){
    return db.query("SELECT * FROM Efforts WHERE segment_strava_id=?",id,callback)
  }
}

router.get('/', function (req, res) {  
  res.render('index')
})

router.get('/segments', function(req, res) {
  Segments.getSegments(function(err,rows){
    if (err) {
      res.json(err)
    }
    else {
      res.json(rows)
    }
  })
})

router.get('/efforts/:id', function(req, res) {
  Efforts.getEffortsBySegmentStravaId(req.params.id, function(err,rows){
    if (err) {
      res.json(err)
    }
    else {
      res.json(rows)
    }
  })
})

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1]
    }
}

if (updateDb) {
  init()
}
else {
  app.listen('3000', () => {
    console.log('Server running on port 3000!')
  })
}


