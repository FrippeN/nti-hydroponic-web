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
      playToggle: false,
      volumeMenuButton: false
    },
    autoplay: true,
    muted: true,
    html5: {
      hls: {
        overrideNative: true,
        liveSyncDurationCount: 30
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    }
  });

  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('webkit-playsinline', '');

  var hls;

  function initializeHls() {
    if (Hls.isSupported()) {
      if (hls) {
        hls.destroy();
      }

      hls = new Hls();
      hls.loadSource("https://hydroponics.ntig.dev/hls/stream.m3u8");
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        player.play();
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else {
            initializeHls();
          }
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = "https://hydroponics.ntig.dev/hls/stream.m3u8";
      player.play();
    }
  }

  initializeHls();

  player.ready(function() {
    var liveButton = document.createElement('button');
    liveButton.className = 'vjs-control vjs-button custom-live-button';
    liveButton.innerHTML = 'LIVE';
    liveButton.style.color = 'red';
    liveButton.style.fontWeight = 'bold';

    liveButton.onclick = function() {
      initializeHls();
    };

    player.controlBar.el().appendChild(liveButton);

    player.on('play', function() {
      if (player.hasStarted() && player.paused()) { // Ensure video has started and is currently paused
        if (hls && hls.liveSyncPosition !== null) {
          videoElement.currentTime = hls.liveSyncPosition;
          console.log('Resumed to live edge:', hls.liveSyncPosition);
        } else {
          console.log('Could not resume to live edge: hls instance or liveSyncPosition not available.');
        }
      } else if (!player.hasStarted()) {
        console.log('Played player (initial play)');
      } else {
        console.log('Played player (not after pause)');
      }
    });
  });

  document.addEventListener('click', function() {
    if (player.paused()) {
      player.play();
    }
  });
});