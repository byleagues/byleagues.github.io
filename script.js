const revealItems = document.querySelectorAll(".reveal");
const profileStatusDot = document.querySelector("[data-profile-status-dot]");
const profileStatusText = document.querySelector("[data-profile-status-text]");
const particleCanvas = document.querySelector("#particleCanvas");
const terminalOutput = document.querySelector("[data-terminal-output]");
const interactiveCards = document.querySelectorAll(
  ".hero-specialties article, .about-card, .experience-card, .timeline-item, .footer-actions"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setupHeroTerminal = () => {
  if (!terminalOutput) {
    return;
  }

  const terminalCard = terminalOutput.closest(".hero-terminal");
  const lines = [
    "> initializing projects...",
    "> loading minecraft systems...",
    "> building server experiences...",
    "> done."
  ];

  if (prefersReducedMotion.matches) {
    terminalOutput.textContent = lines.join("\n");
    terminalCard?.classList.add("is-complete");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let rendered = "";

  const typeNext = () => {
    const currentLine = lines[lineIndex];

    if (!currentLine) {
      terminalCard?.classList.add("is-complete");
      return;
    }

    rendered += currentLine.charAt(charIndex);
    terminalOutput.textContent = rendered;
    charIndex += 1;

    if (charIndex <= currentLine.length) {
      const jitter = Math.floor(Math.random() * 22);
      window.setTimeout(typeNext, 32 + jitter);
      return;
    }

    rendered += lineIndex === lines.length - 1 ? "" : "\n";
    lineIndex += 1;
    charIndex = 0;
    window.setTimeout(typeNext, lineIndex === lines.length ? 260 : 520);
  };

  window.setTimeout(typeNext, 520);
};

const setupParticleNetwork = () => {
  if (!particleCanvas) {
    return;
  }

  const ctx = particleCanvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let particles = [];
  let animationId;
  const mouse = {
    x: null,
    y: null,
    radius: 180
  };

  const isReducedMotion = prefersReducedMotion.matches;

  const settings = {
    desktopCount: isReducedMotion ? 34 : 58,
    mobileCount: isReducedMotion ? 22 : 30,
    maxDistance: 112,
    particleRadius: 1.9,
    speed: isReducedMotion ? 0.1 : 0.24,
    lineColor: "56, 189, 248",
    mouseLineColor: "14, 165, 233",
    dotColor: "226, 232, 240"
  };

  class Particle {
    constructor() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.vx = (Math.random() - 0.5) * settings.speed;
      this.vy = (Math.random() - 0.5) * settings.speed;
      this.radius = Math.random() * settings.particleRadius + 0.7;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > window.innerWidth) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > window.innerHeight) {
        this.vy *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${settings.dotColor}, 0.92)`;
      ctx.fill();
    }
  }

  const createParticles = () => {
    particles = [];
    const count = window.innerWidth < 768 ? settings.mobileCount : settings.desktopCount;

    for (let i = 0; i < count; i += 1) {
      particles.push(new Particle());
    }
  };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createParticles();
  };

  const drawLine = (x1, y1, x2, y2, opacity, color = settings.lineColor) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const connectParticles = () => {
    if (mouse.x === null || mouse.y === null) {
      return;
    }

    const activeParticles = [];

    for (let a = 0; a < particles.length; a += 1) {
      const dxMouse = particles[a].x - mouse.x;
      const dyMouse = particles[a].y - mouse.y;
      const mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (mouseDistance < mouse.radius) {
        const opacity = (1 - mouseDistance / mouse.radius) * 0.68;
        activeParticles.push(particles[a]);
        drawLine(
          particles[a].x,
          particles[a].y,
          mouse.x,
          mouse.y,
          opacity,
          settings.mouseLineColor
        );
      }
    }

    for (let a = 0; a < activeParticles.length; a += 1) {
      for (let b = a + 1; b < activeParticles.length; b += 1) {
        const dx = activeParticles[a].x - activeParticles[b].x;
        const dy = activeParticles[a].y - activeParticles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < settings.maxDistance) {
          const opacity = (1 - distance / settings.maxDistance) * 0.38;
          drawLine(activeParticles[a].x, activeParticles[a].y, activeParticles[b].x, activeParticles[b].y, opacity);
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationId = window.requestAnimationFrame(animate);
  };

  const handlePointerMove = event => {
    const point = event.touches ? event.touches[0] : event;
    mouse.x = point.clientX;
    mouse.y = point.clientY;
  };

  const clearMouse = () => {
    mouse.x = null;
    mouse.y = null;
  };

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("mouseleave", clearMouse);
  window.addEventListener("touchmove", handlePointerMove, { passive: true });
  window.addEventListener("touchend", clearMouse);
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(animationId));
};

const updateProfileStatus = () => {
  if (!profileStatusDot || !profileStatusText) {
    return;
  }

  const isOnline = true;
  profileStatusDot.classList.toggle("is-online", isOnline);
  profileStatusDot.classList.toggle("is-offline", !isOnline);
  profileStatusText.classList.toggle("is-offline", !isOnline);
  profileStatusText.textContent = isOnline ? "Çevrim İçi" : "Çevrim Dışı";
};

updateProfileStatus();
setupHeroTerminal();
setupParticleNetwork();

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

revealItems.forEach(item => observer.observe(item));

interactiveCards.forEach(card => {
  const isHeroCard = card.classList.contains("hero-card");
  const isExperienceCard = card.classList.contains("experience-card");
  const tiltStrength = isHeroCard ? 7 : 9;
  const verticalStrength = isHeroCard ? 6 : 7;

  const resetCard = () => {
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
    card.classList.remove("is-active");
  };

  card.addEventListener("pointerenter", () => {
    card.classList.add("is-active");
  });

  card.addEventListener("pointermove", event => {
    if (prefersReducedMotion.matches || isExperienceCard) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateY = ((offsetX / rect.width) - 0.5) * tiltStrength;
    const rotateX = (0.5 - (offsetY / rect.height)) * verticalStrength;

    card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glow-x", `${(offsetX / rect.width) * 100}%`);
    card.style.setProperty("--glow-y", `${(offsetY / rect.height) * 100}%`);
    card.classList.add("is-active");
  });

  card.addEventListener("pointerleave", resetCard);

  card.addEventListener("pointerdown", () => {
    card.classList.add("is-active");
  });

  card.addEventListener("pointerup", resetCard);
  card.addEventListener("pointercancel", resetCard);
});
