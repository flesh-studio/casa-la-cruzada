(function () {
  "use strict";

  var section = document.getElementById("despiece");
  if (!section) return;

  var canvas = document.getElementById("explodeCanvas");
  var ctx = canvas.getContext("2d");
  var loader = document.getElementById("explodeLoader");
  var progressBar = document.getElementById("explodeProgressBar");
  var captions = section.querySelectorAll(".explode__caption");

  var FRAME_COUNT = 40;
  var frames = new Array(FRAME_COUNT);
  var loadedCount = 0;
  var currentFrame = -1;
  var firstFrameReady = false;

  // Source frames run exploded (frame-001) -> assembled (frame-040),
  // and the section reads in that same order as the user scrolls in.
  function framePath(i) {
    var fileNum = i + 1;
    var n = String(fileNum);
    while (n.length < 3) n = "0" + n;
    return "assets/img/frames/frame-" + n + ".jpg";
  }

  function drawFrame(index) {
    var img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    if (!cw || !ch) return;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvasRatio = cw / ch;
    var imgRatio = iw / ih;
    var dw, dh, dx, dy;
    if (imgRatio > canvasRatio) {
      dh = ch; dw = ch * imgRatio; dx = (cw - dw) / 2; dy = 0;
    } else {
      dw = cw; dh = cw / imgRatio; dx = 0; dy = (ch - dh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    currentFrame = index;
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    var idx = currentFrame >= 0 ? currentFrame : 0;
    currentFrame = -1;
    drawFrame(idx);
  }

  function preload() {
    for (var i = 0; i < FRAME_COUNT; i++) {
      (function (idx) {
        var img = new Image();
        img.onload = img.onerror = function () {
          loadedCount++;
          if (idx === 0 && !firstFrameReady) {
            firstFrameReady = true;
            resizeCanvas();
            canvas.classList.add("is-ready");
          }
          if (loadedCount === FRAME_COUNT && loader) {
            loader.classList.add("is-hidden");
          }
        };
        img.src = framePath(idx);
        frames[idx] = img;
      })(i);
    }
  }

  var ticking = false;
  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var progress = total > 0 ? (-rect.top) / total : 0;
    progress = Math.max(0, Math.min(1, progress));

    var frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
    if (frameIndex !== currentFrame && frames[frameIndex] && frames[frameIndex].complete) {
      drawFrame(frameIndex);
    }

    if (progressBar) progressBar.style.width = (progress * 100) + "%";

    var stage = 0;
    if (progress >= 0.9) stage = 3;
    else if (progress >= 0.6) stage = 2;
    else if (progress >= 0.3) stage = 1;

    captions.forEach(function (cap) {
      var capStage = parseInt(cap.getAttribute("data-stage"), 10);
      cap.classList.toggle("is-active", capStage === stage);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  preload();
  resizeCanvas();
  update();
})();
