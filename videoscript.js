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
      playToggle: {}, // Added play/pause button
      volumeMenuButton: false
    },
    autoplay: true,
    muted: true,
    html5: {
      hls: {
        // overrideNative: true, // Consider removing this line after thorough testing on mobile
        liveSyncDurationCount: 30
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    }
  });

  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('webkit-playsinline', '');

  var hls;
  var playButtonOverlay = document.createElement('div');
  playButtonOverlay.className = 'play-button-overlay';
  playButtonOverlay.innerHTML = '<span>Play</span>';
  videoElement.parentNode.insertBefore(playButtonOverlay, videoElement.nextSibling);
  playButtonOverlay.style.position = 'absolute';
  playButtonOverlay.style.top = '50%';
  playButtonOverlay.style.left = '50%';
  playButtonOverlay.style.transform = 'translate(-50%, -50%)';
  playButtonOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  playButtonOverlay.style.color = 'white';
  playButtonOverlay.style.padding = '10px 20px';
  playButtonOverlay.style.borderRadius = '5px';
  playButtonOverlay.style.cursor = 'pointer';
  playButtonOverlay.style.display = 'block'; // Initially show the play button on mobile

  function initializeHls() {
    if (Hls.isSupported()) {
      if (hls) {
        hls.destroy();
      }

      hls = new Hls();
      hls.loadSource("https://hydroponics.ntig.dev/hls/stream.m3u8");
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        // Attempt to play, handle the promise
        var playPromise = player.play();

        if (playPromise !== undefined) {
          playPromise.then(function() {
            playButtonOverlay.style.display = 'none'; // Autoplay started successfully after user interaction
          }).catch(function(error) {
            // Autoplay was prevented, the overlay will remain
            console.log("Autoplay prevented:", error);
          });
        } else {
          playButtonOverlay.style.display = 'none'; // No promise returned, assume success or handle differently
        }
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          console.error("HLS fatal error:", data);
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
      // Seek to live edge instead of re-initializing
      if (hls && hls.liveSyncPosition !== null) {
        player.currentTime(hls.liveSyncPosition);
        console.log('Jumped to live edge.');
      } else {
        console.log('Could not jump to live edge: hls instance or liveSyncPosition not available.');
        initializeHls(); // Fallback to re-initialization if needed
      }
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

  playButtonOverlay.addEventListener('click', function() {
    player.play();
    playButtonOverlay.style.display = 'none';
  });

  // Removed the document-level click listener
});