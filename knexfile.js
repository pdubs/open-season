var devUrl = 'mysql://root@127.0.0.1:3306/strava';
var prodUrl = 'not-defined-yet';

module.exports = {
  client: 'mysql',
  connection: devUrl,
  useNullAsDefault: true
}