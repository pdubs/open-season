var app = angular.module('strava-app', []);

app.factory('dataService', function($http) {
  return {
    getSegments: function() {
      return $http.get('/segments').then(function(segments) {
        return segments;
      });
    },
    gettop200BySegmentId: function(segment_id) {
      return $http.get('/efforts/' + segment_id).then(function(top200efforts) {
        return top200efforts;
      })
    }
  }
});

app.controller('StravaAppController', function($scope, $http, dataService, $q) {
  dataService.getSegments().then(function(response) {
    $scope.segments = response.data;
    let top200RequestPromises = [];

    $scope.segments.map(function(segment){
      top200RequestPromises.push(dataService.gettop200BySegmentId(segment.strava_id));
    });
    console.log(' ** DONE FETCHING + PREPARING SEGMENTS');

    return $q.all(top200RequestPromises);
  }).then(function(result) {
    for (var i=0; i<result.length; i++){
      let top200 = result[i].data;
      let currentId = top200[0].segment_strava_id;

      $scope.segments.map(function(segment) {
        if (segment.strava_id == currentId) { segment.top200 = top200; }
        return segment;
      })
    }
    console.log(' ** DONE FETCHING + PREPARING TOP 200');

    $scope.burroData = []

    // begin data processing for date charts
    $scope.segments.map(function(segment) {
      let chartData = [];
      segment.top200.map(function(effort) {
        let o = {
          date: new Date(effort.start_date_local.split('T')[0]),
          elapsed_time:  Math.round((effort.elapsed_time / 60) * 1000) / 1000,
          rank: effort.rank
        };
        o.month = o.date.toLocaleString("en-us", { month: "long" });
        o.day = o.date.getDay();
        chartData.push(o);
      });
      segment.chartData = chartData;

      let effortsPerMonth = {}

      segment.chartData.map(function(effort) {
        let month = effort.month;
        effortsPerMonth[month] = (effortsPerMonth[month]) ? effortsPerMonth[month] + 1 : 1;
        effort.effortsPerMonth = effortsPerMonth;
        return effort;
      })
      segment.effortsPerMonth = effortsPerMonth;

      return segment;
    });

    console.log(' ** SEGMENTS: ', $scope.segments);

    let segmentsSeriesData = [];
    $scope.segments.map(function(segment){
      let o = {
        name: segment.name,
        data: [
          segment.effortsPerMonth.June,
          segment.effortsPerMonth.July, 
          segment.effortsPerMonth.August, 
          segment.effortsPerMonth.September, 
          segment.effortsPerMonth.October,
          segment.effortsPerMonth.November
        ]
      }
      segmentsSeriesData.push(o);
    });

    Highcharts.chart('container', {
        exporting: { enabled: false },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Top 200 Efforts per Month'
        },
        xAxis: {
            categories: [
                'June',
                'July',
                'August',
                'September',
                'October',
                'November'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Efforts'
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: segmentsSeriesData
    });




  })



});


















