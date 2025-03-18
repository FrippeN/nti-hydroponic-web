document.addEventListener("DOMContentLoaded", function () {
  // Set liveDelay to 60 seconds behind the live edge.
  var liveDelay = 60;

  var player = new Clappr.Player({
    source: "https://hydroponics.ntig.dev/hls/stream.m3u8",
    parentId: "#player",
    autoPlay: true,
    mute: true,
    isLive: true,
    height: "100%",
    width: "100%",
    playback: {
      hlsjsConfig: {
        liveSyncDuration: liveDelay,
        liveMaxLatencyDuration: liveDelay + 5,
        maxBufferLength: liveDelay * 2,
        maxMaxBufferLength: liveDelay * 2,
        backBufferLength: liveDelay * 2,
      },
    },
  });

  // Function to seek to a point liveDelay seconds behind the current duration
  function seekToLiveEdge() {
    var playback = player.core.getCurrentPlayback();
    if (playback && playback.getDuration) {
      var duration = playback.getDuration();
      if (duration && !isNaN(duration) && duration > liveDelay) {
        var targetPosition = duration - liveDelay;
        // Only seek if we're more than 5 seconds away from the target
        if (Math.abs(playback.currentTime - targetPosition) > 5) {
          player.seek(targetPosition);
          console.log("Jumped to live edge (delay " + liveDelay + "s):", targetPosition);
        }
      } else {
        console.log("Live edge not available or not enough duration.");
      }
    }
  }

  // Force seek to live edge (with 60s delay) when playback starts.
  player.on(Clappr.Events.PLAYER_PLAY, function () {
    seekToLiveEdge();
  });

  // Also, force the seek after any seek operation completes.
  player.on(Clappr.Events.PLAYER_SEEKED, function () {
    seekToLiveEdge();
  });

  console.log("Clappr player initialized with a " + liveDelay + "s live delay sync.");
});
