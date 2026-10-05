/* Load the original stream only after a deliberate user action. */
(() => {
  const start = document.querySelector("#start-stream");
  if (!start) return;
  const placeholder = document.querySelector("#stream-placeholder");
  const status = document.querySelector("#stream-status");
  const message = document.querySelector("#stream-message");
  let player;
  let timer;
  let attempt = 0;
  function unavailable() {
    clearTimeout(timer);
    const failedPlayer = player;
    player = null;
    failedPlayer?.destroy();
    placeholder.hidden = false;
    status.textContent = "Kunde inte spela upp";
    message.textContent =
      "Ingen sändning kunde bekräftas. Videokällan kan vara otillgänglig.";
    start.disabled = false;
    start.textContent = "Försök igen ▷";
  }
  function initialize(currentAttempt) {
    if (currentAttempt !== attempt || !start.disabled) return;
    try {
      player = new Clappr.Player({
        source: "https://hydroponics.ntig.dev/hls/stream.m3u8",
        parentId: "#player",
        autoPlay: true,
        mute: true,
        isLive: true,
        height: "100%",
        width: "100%",
      });
      player.on(Clappr.Events.PLAYER_PLAY, () => {
        clearTimeout(timer);
        status.textContent = "Spelar upp";
        message.textContent = "Video från projektets befintliga videokälla.";
        placeholder.hidden = true;
      });
      player.on(Clappr.Events.PLAYER_ERROR, unavailable);
    } catch (_) {
      unavailable();
    }
  }
  start.addEventListener("click", () => {
    const currentAttempt = ++attempt;
    start.disabled = true;
    status.textContent = "Ansluter…";
    message.textContent = "Kontrollerar videokällan…";
    placeholder.hidden = true;
    timer = setTimeout(unavailable, 20000);
    if (window.Clappr) initialize(currentAttempt);
    else {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/clappr@0.3.13/dist/clappr.min.js";
      script.onload = () => initialize(currentAttempt);
      script.onerror = () => {
        if (currentAttempt === attempt) unavailable();
      };
      document.head.append(script);
    }
  });
})();
