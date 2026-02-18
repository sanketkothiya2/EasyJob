'use client';

import confetti from 'canvas-confetti';

// Default confetti blast for celebrations
export function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// Pink-themed confetti for job acceptance celebration
export function triggerPinkConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#FF6B9D', '#C44569', '#FF8FB1', '#FFB6C1', '#FF69B4'];

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: randomInRange(0.1, 0.3),
        y: Math.random() - 0.2,
      },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: randomInRange(0.7, 0.9),
        y: Math.random() - 0.2,
      },
      colors,
      zIndex: 9999,
    });
  }, 250);
}

// Fireworks effect for major achievements
export function triggerFireworks() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

// Subtle celebration for milestones
export function triggerSubtleConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B9D', '#C44569', '#FFB6C1'],
    zIndex: 9999,
  });
}

// Side cannons effect
export function triggerSideCannons() {
  const end = Date.now() + 1000;
  const colors = ['#FF6B9D', '#C44569', '#FF8FB1'];

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
