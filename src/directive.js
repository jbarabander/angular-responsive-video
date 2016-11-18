var Hls = require('hls.js');

module.exports = ['$sce', function ($sce) {
  return {
    restrict: 'E',
    scope: {
      thumbnail: '@',
      streamingSrc: '@',
      fallbacks: '<',
      height: '@',
      width: '@'
    },
    template: '<div><video class="video-to-play" preload="metadata"></video></div>',
    link: function (scope, element, attr) {
      var outerDiv = element.children()[0];
      scope.safeStreamingSrc = $sce.trustAsResourceUrl(scope.streamingSrc);
      scope.safeFallbackSrc = $sce.trustAsResourceUrl(scope.fallbackSrc);
      var videoElement = document.getElementsByClassName('video-to-play')[0];
      var isProperHeight = !isNaN(parseInt(scope.height));
      var isProperWidth = !isNaN(parseInt(scope.width));
      videoElement.setAttribute("controls","controls");
      videoElement.setAttribute("height", isProperHeight ? scope.height : "270");
      videoElement.setAttribute("width", isProperWidth ? scope.width : "480");
      var canPlayHls = videoElement.canPlayType('application/vnd.apple.mpegURL');
      if (canPlayHls === '' && Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(scope.streamingSrc);
        hls.attachMedia(videoElement);
      } else {
        var source = createSourceElement(scope.streamingSrc);
        videoElement.appendChild(source);
        if (Array.isArray(scope.fallbacks)) {
          scope.fallbacks.forEach(function (uri) {
            var alternateSource = createSourceElement(uri);
            videoElement.appendChild(alternateSource);
          })
        }
      }
    }
  }
}];

function createSourceElement (src) {
  var source = document.createElement('source');
  source.setAttribute('src', src);
  return source;
}
