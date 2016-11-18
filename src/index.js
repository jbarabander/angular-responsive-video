var appName = 'angularHlsVideo';
var app = angular.module(appName, []);
app.directive('hlsVideo', require('./directive'));
module.exports = appName;
