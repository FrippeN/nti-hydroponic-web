document.addEventListener("DOMContentLoaded", function() {
  var videoElement = document.getElementById("video");
  var player = videojs(videoElement, {
    liveui: true,
    controlBar: {
      liveDisplay: true,
      seekBar: false,
      progressControl: false,
      currentTimeDisplay: false,
      durationDisplay: false,
      remainingTimeDisplay: false,
      playToggle: false // Remove the play/pause button
    },
    html5: {
      hls: {
        liveSyncDurationCount: 30 // Set the player to be 30 seconds behind live
      }
    }
  });

  function initializeHls() {
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource("https://hydroponics.ntig.dev/hls/stream.m3u8");
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        player.play();
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = "https://hydroponics.ntig.dev/hls/stream.m3u8";
      player.play();
    }
  }

  initializeHls();

  // Force the player to play on initialization
  player.ready(function() {
    player.play();
  });
});