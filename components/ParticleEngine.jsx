"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

const ParticleEngine = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  const particles = useRef([]);
  const rockets = useRef([]);
  const textCache = useRef({});
  const bgTextCache = useRef({});

  useImperativeHandle(ref, () => ({
    launchRocket,
    explode,
    explodeName,
    bgClickText,
  }));

  function buildTextCache() {
    const phrases = [
      "YOUR NAME",
      "Happy Birthday!",
      "I Love You!",
      "Sehat Selalu!",
      "Bahagia Terus!",
      "Makin Sukses!",
      "Love You Always!",
      "Wish You The Best!",
    ];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const isMobile = window.innerWidth < 768;

    canvas.width = isMobile ? 1000 : 1400;
    canvas.height = isMobile ? 200 : 250;

    ctx.fillStyle = "white";
    ctx.font = isMobile ? "bold 100px Arial" : "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    phrases.forEach((text) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const offsetX = canvas.width / 2;
      const offsetY = canvas.height / 2;

      const explodePoints = [];
      const bgPoints = [];

      // High quality (for explodeName)
      for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
          const alpha = image[(y * canvas.width + x) * 4 + 3];

          if (alpha > 128) {
            explodePoints.push({
              x: (x - offsetX) * 0.5,
              y: (y - offsetY) * 0.5,
            });
          }
        }
      }

      // Lower quality (for bgClick)
      const bgStep = window.innerWidth < 768 ? 6 : 5;

      for (let y = 0; y < canvas.height; y += bgStep) {
        for (let x = 0; x < canvas.width; x += bgStep) {
          const alpha = image[(y * canvas.width + x) * 4 + 3];

          if (alpha > 128) {
            bgPoints.push({
              x: (x - offsetX) * 0.5,
              y: (y - offsetY) * 0.5,
            });
          }
        }
      }

      textCache.current[text] = explodePoints;
      bgTextCache.current[text] = bgPoints;
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    buildTextCache();
    window.addEventListener("resize", resize);

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateRockets();
      updateParticles();

      drawRockets(ctx);
      drawParticles(ctx);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  //--------------------------------------------------------
  // ROCKET
  //--------------------------------------------------------

  function launchRocket() {
    rockets.current.push({
      x: window.innerWidth / 2,
      y: window.innerHeight,
      vx: 0,
      vy: window.innerWidth < 768 ? -8 : -10,
      life: 100,
    });
  }

  function updateRockets() {
    rockets.current.forEach((r) => {
      r.x += r.vx;
      r.y += r.vy;

      r.vy += 0.05;

      createTrail(r.x, r.y);

      r.life--;

      if (r.life <= 0) {
        explode(r.x, r.y);

        setTimeout(() => {
          explodeName(r.x, r.y, "YOUR NAME");
        }, 250);
      }
    });

    rockets.current = rockets.current.filter((r) => r.life > 0);
  }

  //--------------------------------------------------------
  // PARTICLES
  //--------------------------------------------------------

  function createParticle(x, y, vx, vy, color, size = 3) {
    particles.current.push({
      x,
      y,
      vx,
      vy,
      alpha: 1,
      size,
      color,
      trail: [],
    });
  }

  function updateParticles() {
    particles.current.forEach((p) => {
      if (!p.isText) {
        p.trail.push({
          x: p.x,
          y: p.y,
        });

        if (p.trail.length > 12) {
          p.trail.shift();
        }
      }

      if (p.isText) {
        p.x += (p.targetX - p.x) * 0.18;
        p.y += (p.targetY - p.y) * 0.18;

        p.vx = 0;
        p.vy = 0;
      }

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= p.drag ?? 0.985;
      p.vy *= p.drag ?? 0.985;

      p.vy += p.gravity ?? 0.03;

      if (p.isText) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        if (dx * dx + dy * dy < 16) {
          p.vx *= 0.8;
          p.vy *= 0.8;

          p.lifeTime = (p.lifeTime || 0) + 1;

          if (p.lifeTime > 45) {
            p.alpha -= 0.05;
          }
        }
      } else {
        p.alpha -= 0.008;
      }
    });

    particles.current = particles.current.filter((p) => p.alpha > 0);
  }

  //--------------------------------------------------------
  // DRAW
  //--------------------------------------------------------

  function drawParticles(ctx) {
    const glowParticles = [];
    const normalParticles = [];

    particles.current.forEach((p) => {
      if (p.alpha <= 0) return;

      if (p.isText) {
        normalParticles.push(p);
      } else {
        glowParticles.push(p);
      }
    });

    //-----------------------------
    // Draw glow particles once
    //-----------------------------

    ctx.shadowBlur = 18;
    const glowGroups = {};

    glowParticles.forEach((p) => {
      if (!glowGroups[p.color]) glowGroups[p.color] = [];
      glowGroups[p.color].push(p);
    });

    ctx.shadowBlur = 18;

    Object.entries(glowGroups).forEach(([color, list]) => {
      ctx.shadowColor = color;

      list.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    ctx.shadowBlur = 0;

    //-----------------------------
    // Draw text particles
    //-----------------------------

    normalParticles.forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function drawRockets(ctx) {
    rockets.current.forEach((r) => {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "white";

      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);

      ctx.fill();

      ctx.shadowBlur = 0;
    });
  }

  //--------------------------------------------------------
  // TRAIL
  //--------------------------------------------------------

  function createTrail(x, y) {
    createParticle(
      x,
      y,
      Math.random() * 2 - 1,
      Math.random() * 2 + 1,
      "#ffffff",
      2,
    );
  }

  //--------------------------------------------------------
  // EXPLOSION
  //--------------------------------------------------------

  function explode(x, y) {
    const colors = [
      "#ff4040",
      "#ffd93d",
      "#40ff7c",
      "#40bfff",
      "#ff66ff",
      "#ffffff",
    ];

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 120 : 250;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;

      const isMobile = window.innerWidth < 768;

      const speed = isMobile
        ? Math.random() * 5 + 3 // 3–8
        : Math.random() * 8 + 5; // 5–13

      const color = colors[Math.floor(Math.random() * colors.length)];

      createParticle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        Math.random() * 3 + 2,
      );

      // Give the particle extra properties
      const p = particles.current[particles.current.length - 1];

      p.drag = 0.985;
      p.gravity = 0.045;
      p.sparkle = Math.random() < 0.25;
    }
  }

  function createMiniExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;

      createParticle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        1.5,
      );

      const p = particles.current[particles.current.length - 1];

      p.drag = 0.96;
      p.gravity = 0.02;
      p.sparkle = false;
      p.alpha = 0.7;
      p.trail = [];
      p.isMini = true;
    }
  }

  //--------------------------------------------------------
  // CLICK TEXT
  //--------------------------------------------------------

  function explodeName(centerX, centerY, text) {
    const points = textCache.current[text];

    if (!points) return;

    points.forEach((point) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180;

      createParticle(
        centerX,
        centerY,
        Math.cos(angle) * radius * 0.08,
        Math.sin(angle) * radius * 0.08,
        "#ffffff",
        1,
      );

      const p = particles.current[particles.current.length - 1];

      p.targetX = centerX + point.x;
      p.targetY = centerY + point.y;

      p.isText = true;
      p.drag = 0.92;
      p.gravity = 0;
      p.alpha = 1;
    });
  }

  function bgClickText(centerX, centerY, text) {
    const textColors = [
      "#ffffff",
      "#40bfff", // blue
      "#40ff7c", // green
      "#ff66ff", // purple
      "#ffd93d", // yellow
      "#ff4040", // red
    ];
    const points = bgTextCache.current[text];

    if (!points) return;

    const color = textColors[Math.floor(Math.random() * textColors.length)];

    points.forEach((point) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 80;

      createParticle(
        centerX,
        centerY,
        Math.cos(angle) * radius * 0.12,
        Math.sin(angle) * radius * 0.12,
        color,
        0.8,
      );

      const p = particles.current[particles.current.length - 1];

      const scale = window.innerWidth < 768 ? 0.6 : 0.9;

      p.targetX = centerX + point.x * scale;
      p.targetY = centerY + point.y * scale;

      p.isText = true;
      p.drag = 0.96;
      p.gravity = 0;
      p.alpha = 1;
    });
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
});

export default ParticleEngine;
