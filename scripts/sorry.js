document.addEventListener('DOMContentLoaded', () => {
  const bgDecorations = document.getElementById('bg-decorations');
  const apologyCard = document.getElementById('apology-card');
  const successCard = document.getElementById('success-card');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  // --- Floating Background Hearts & Sparkles ---
  const icons = ['fa-heart', 'fa-heart', 'fa-sparkles', 'fa-star'];

  function createFloatingIcon() {
    const icon = document.createElement('i');
    // Mostly hearts, occasionally stars/sparkles
    const rand = Math.random();
    if (rand < 0.7) {
      icon.className = 'fa-solid fa-heart floating-heart';
    } else if (rand < 0.85) {
      icon.className = 'fa-solid fa-star floating-heart';
    } else {
      icon.className = 'fa-solid fa-wand-magic-sparkles floating-heart';
    }

    // Randomize size
    const size = Math.random() * 20 + 10; // 10px to 30px
    icon.style.fontSize = `${size}px`;

    // Randomize horizontal starting position
    icon.style.left = `${Math.random() * 100}vw`;

    // Randomize animation speed
    const duration = Math.random() * 5 + 5; // 5s to 10s
    icon.style.animationDuration = `${duration}s`;

    // Randomize opacity
    icon.style.opacity = Math.random() * 0.4 + 0.1;

    // Add to DOM
    bgDecorations.appendChild(icon);

    // Clean up
    setTimeout(() => {
      icon.remove();
    }, duration * 1000);
  }

  // Spawn heart elements periodically
  setInterval(createFloatingIcon, 400);

  // Initial batch of background elements
  for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingIcon, Math.random() * 2000);
  }

  // --- "NO" Button Dodging Logic ---
  function moveNoButton(e) {
    // Prevent click default if triggered on touch/click
    if (e) e.preventDefault();

    const btnWidth = noBtn.offsetWidth || 110;
    const btnHeight = noBtn.offsetHeight || 50;

    // Viewport dimensions (using clientWidth/Height for accurate mobile viewport sizes)
    const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const vh = Math.min(window.innerHeight, document.documentElement.clientHeight);

    // Safe boundaries from edges (larger bottom padding to clear mobile navigation bars)
    const paddingX = 25;
    const paddingTop = 25;
    const paddingBottom = 100;

    // On desktop, restrict button movement to a centered zone around the card (e.g. 600px wide/high)
    // On mobile, use the full viewport width/height.
    const activeWidth = Math.min(vw, 600);
    const activeHeight = Math.min(vh, 600);

    const minX = Math.round((vw - activeWidth) / 2) + paddingX;
    const maxX = Math.round((vw + activeWidth) / 2) - btnWidth - paddingX;

    const minY = Math.round((vh - activeHeight) / 2) + paddingTop;
    const maxY = Math.round((vh + activeHeight) / 2) - btnHeight - paddingBottom;

    let newX, newY;
    let attempts = 0;

    // Target Rectangles for distance checks
    const yesRect = yesBtn.getBoundingClientRect();
    const currentRect = noBtn.getBoundingClientRect();

    // Let's get the click/tap coordinate if available
    const cursorX = e ? e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null) : null;
    const cursorY = e ? e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null) : null;

    // Distance thresholds
    let minCursorDist = 90;
    let minYesDist = 100;
    let minCurrentDist = 120; // minimum distance to move from current position

    do {
      const rangeX = maxX - minX;
      const rangeY = maxY - minY;

      newX = rangeX > 0 ? Math.round(Math.random() * rangeX) + minX : minX;
      newY = rangeY > 0 ? Math.round(Math.random() * rangeY) + minY : minY;
      attempts++;

      // Distance from click/tap point
      const distToCursor =
        cursorX && cursorY ? Math.hypot(newX + btnWidth / 2 - cursorX, newY + btnHeight / 2 - cursorY) : 999;
      // Distance from YES button (so it doesn't overlap it)
      const distToYes = Math.hypot(newX - yesRect.left, newY - yesRect.top);
      // Distance from its current location (so it definitely jumps away)
      const distToCurrent = Math.hypot(newX - currentRect.left, newY - currentRect.top);

      // Relax constraints on small screens if we can't find a perfect spot quickly
      if (attempts > 30) {
        minCursorDist = 60;
        minYesDist = 80;
        minCurrentDist = 80;
      }
      if (attempts > 60) {
        minCursorDist = 30;
        minYesDist = 45;
        minCurrentDist = 45;
      }

      // Accept coordinates if they meet thresholds
      if (distToCursor > minCursorDist && distToYes > minYesDist && distToCurrent > minCurrentDist) {
        break;
      }
    } while (attempts < 100);

    // Apply style changes
    noBtn.classList.add('dodging');
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
  }

  // Dodge events (only on click/tap to prevent hover issues and work properly on mobile)
  noBtn.addEventListener('click', moveNoButton);

  // --- "YES" Button Success Logic ---
  function triggerConfetti() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti launch from two sources (left and right edges)
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      );
    }, 250);
  }

  yesBtn.addEventListener('click', () => {
    // Hide Apology Card with transition
    apologyCard.classList.add('fade-out');

    setTimeout(() => {
      apologyCard.classList.add('hidden');
      apologyCard.classList.remove('fade-out');

      // Show Success Card
      successCard.classList.remove('hidden');

      // Fire Confetti!
      triggerConfetti();
    }, 400);
  });

  // --- Close Success/Reset Logic ---
  closeSuccessBtn.addEventListener('click', () => {
    // Hide success card
    successCard.classList.add('hidden');

    // Reset and show apology card
    apologyCard.classList.remove('hidden');

    // Reset NO button position
    noBtn.classList.remove('dodging');
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
  });
});
