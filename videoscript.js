document.addEventListener("DOMContentLoaded", function () {
  var player = new Clappr.Player({
    source: "https://hydroponics.ntig.dev/hls/stream.m3u8",
    parentId: "#player",
    autoPlay: true,
    mute: true,
    isLive: true,
    height: "100%",
    width: "100%",
    dvrEnabled: true,
    playback: {
      hlsjsConfig: {
        maxBufferLength: 7200,      // Allow up to 2 hours (in seconds) of buffer
        liveSyncDuration: 30,       // How close to live edge to stay (in seconds)
        liveMaxLatencyDuration: 7200 // Maximum latency allowed (2 hours)
      },
    },
  });

  // Optional: log available duration after load
  player.on(Clappr.Events.PLAYER_PLAY, function () {
    var playback = player.core.getCurrentPlayback();
    if (playback && playback.getDuration) {
      console.log("Stream duration (should include DVR window):", playback.getDuration());
    }
  });

  // Log player errors
  player.on(Clappr.Events.PLAYER_ERROR, function (error) {
    console.error("Clappr player error:", error);
  });

  console.log("Clappr player initialized with 2-hour DVR support.");
});