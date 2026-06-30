"use client";

import { useState, useRef, useEffect } from "react";
import { FaGift } from "react-icons/fa6";
import gsap from "gsap";
import { Fireworks } from "@fireworks-js/react";
import ParticleEngine from "@/components/ParticleEngine.jsx";

export default function Home() {
  const [isFading, setIsFading] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const particleEngine = useRef(null);
  useEffect(() => {
    const canvas = document.getElementById("fireworkCanvas");

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const canClick = useRef(true);
  const lastText = useRef(null);
  const texts = [
    "Happy Birthday!",
    "I Love You!",
    "Sehat Selalu!",
    "Bahagia Terus!",
    "Makin Sukses!",
    "Love You Always!",
    "Wish You The Best!",
  ];

  const explode = (x, y) => {
    const canvas = document.getElementById("fireworkCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const particles = [];

    const colors = [
      "#ff4040",
      "#ffd93d",
      "#40ff7c",
      "#40bfff",
      "#ff66ff",
      "#ffffff",
    ];

    for (let i = 0; i < 150; i++) {
      const angle = (Math.PI * 2 * i) / 150;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * gsap.utils.random(4, 8),
        vy: Math.sin(angle) * gsap.utils.random(4, 8),
        alpha: 1,
        radius: gsap.utils.random(2, 4),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.vx *= 0.992;
        p.vy *= 0.992;

        p.vy += 0.04;

        p.alpha -= 0.01;

        ctx.globalAlpha = Math.max(p.alpha, 0);

        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;

        ctx.fill();

        if (Math.random() < 0.15) {
          ctx.beginPath();
          ctx.fillStyle = "#ffffff";
          ctx.arc(
            p.x + gsap.utils.random(-3, 3),
            p.y + gsap.utils.random(-3, 3),
            1,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;

      if (particles.some((p) => p.alpha > 0)) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  };

  const explodeName = (centerX, centerY) => {
    const name = "YOUR NAME"; // Change to birthday person's name

    // Hidden canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 700;
    canvas.height = 200;

    ctx.fillStyle = "white";
    ctx.font = "bold 110px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const particles = [];

    // Every 5 pixels keeps it dotted like the reference
    for (let y = 0; y < canvas.height; y += 5) {
      for (let x = 0; x < canvas.width; x += 5) {
        const alpha = image[(y * canvas.width + x) * 4 + 3];

        if (alpha > 128) {
          particles.push({
            x,
            y,
          });
        }
      }
    }

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    particles.forEach((p) => {
      const dot = document.createElement("div");

      dot.className =
        "fixed w-[2px] h-[2px] rounded-full bg-white pointer-events-none";

      // Spawn every particle at the explosion center
      dot.style.left = `${centerX}px`;
      dot.style.top = `${centerY}px`;

      document.body.appendChild(dot);

      const spread = 180;

      gsap.set(dot, {
        x: gsap.utils.random(-spread, spread),
        y: gsap.utils.random(-spread, spread),
        scale: gsap.utils.random(0.2, 2),
        opacity: 0,
      });

      // Gather into the text
      gsap.to(dot, {
        x: (p.x - offsetX) * 0.5,
        y: (p.y - offsetY) * 0.5,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });

      // Fade out afterwards
      gsap.to(dot, {
        opacity: 0,
        duration: 0.6,
        delay: 2,
        onComplete: () => dot.remove(),
      });
    });
  };

  const launchIntroFirework = () => {
    particleEngine.current?.launchRocket();

    setTimeout(() => {
      setShowFireworks(true);
    }, 2200);
  };

  const bgClick = (e) => {
    if (!canClick.current) return;

    canClick.current = false;
    setTimeout(() => {
      canClick.current = true;
    }, 300);

    let randomText;

    do {
      randomText = texts[Math.floor(Math.random() * texts.length)];
    } while (randomText === lastText.current && texts.length > 1);

    lastText.current = randomText;

    // ----- Draw text onto a hidden canvas -----
    particleEngine.current?.bgClickText(e.clientX, e.clientY, randomText);
  };

  const handleClose = () => {
    window.location.reload();
  };

  const handleClick = () => {
    setIsFading(true);

    setTimeout(() => {
      setShowCard(false);

      launchIntroFirework();

      // Show the button later
      setTimeout(() => {
        setShowSurprise(true);
      }, 5000);
    }, 500);
  };

  return (
    <div
      onClick={showSurprise ? bgClick : undefined}
      className="min-h-screen overflow-hidden bg-black"
    >
      <ParticleEngine ref={particleEngine} />
      {showFireworks && (
        <Fireworks
          options={{
            rocketsPoint: { min: 50, max: 50 },
            hue: { min: 0, max: 360 },
            delay: { min: 50, max: 100 },
            acceleration: 1.05,
            friction: 0.95,
            gravity: 1.5,
            particles: 120,
            explosion: 6,
          }}
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
      )}
      <canvas
        id="fireworkCanvas"
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 md:px-24 gap-5">
        {showCard && (
          <div
            id="card"
            className={`flex flex-col items-center justify-center gap-5 transition-all duration-500 ${
              isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <h1 className="animate-pulse text-center text-3xl md:text-5xl font-bold text-[#00ffc0] drop-shadow-[0_0_15px_rgba(0,255,192,.8)]">
              Happy Birthday!
            </h1>

            <FaGift
              onClick={handleClick}
              className="animate-bounce text-5xl md:text-7xl text-[#eeff00] drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] mt-4 hover:cursor-pointer hover:text-7xl duration-300"
            />

            <p className="mt-4 text-center text-sm md:text-lg font-semibold">
              Click the gift for a surprise!
            </p>
          </div>
        )}
        {showSurprise && !showPopup && (
          <div className="mt-auto pb-10">
            <button
              onClick={() => setShowPopup(true)}
              className="text-white border-2 border-white rounded-3xl bg-white/25 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-[0_0_15px_rgba(255,255,255)] px-6 py-3"
            >
              Show Special Message ✨
            </button>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm z-50">
          <div className="min-h-screen flex justify-center items-center px-4 py-4">
            <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
              <div className="flex flex-col lg:w-1/3 w-full">
                <div className="flex flex-col justify-center items-center gap-8 lg:gap-16">
                  <img
                    src="http://dummyimage.com/200x200"
                    className="w-48 rounded-2xl shadow-xl animate-pop -rotate-12"
                  />

                  <img
                    src="http://dummyimage.com/200x200"
                    className="w-48 rounded-2xl shadow-xl animate-pop rotate-6"
                  />

                  <img
                    src="http://dummyimage.com/200x200"
                    className="w-48 rounded-2xl shadow-xl animate-pop -rotate-6"
                  />
                </div>
              </div>
              <div
                className="w-full
lg:w-1/3
max-w-3xl
    max-h-[80vh]
    overflow-y-auto
    animate-pop
    bg-gray-900/50
    text-white
    rounded-2xl
    border
    border-gray-700/50
    p-8"
              >
                <h2 className="text-3xl text-center font-bold mb-4">
                  🎉 Happy Birthday (YOUR NAME) 🎉
                </h2>
                <div className="space-y-3 text-center">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Vitae impedit sunt qui accusantium sint, aperiam natus a
                    aliquid eaque magni deleniti quia perspiciatis adipisci
                    velit quasi enim et, voluptatibus temporibus ab explicabo
                    error in id fugiat facere? Tenetur magnam magni velit
                    voluptates ut sunt explicabo illum error illo soluta esse,
                    dolores natus necessitatibus corporis debitis, suscipit
                    temporibus eaque asperiores delectus. Delectus a in
                    provident repudiandae odio illo id expedita aperiam
                    temporibus eius natus aut error maiores assumenda quis
                    distinctio aspernatur, quisquam ratione odit vero fugit
                    saepe harum! Nemo repudiandae quam ab iusto magni vitae
                    facere reiciendis, exercitationem assumenda in consequuntur!
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full text-gray-300 font-semibold underline mt-10 hover:text-gray-400 hover:font-bold hover:cursor-pointer"
                >
                  Start Again
                </button>
              </div>
              <div className="flex flex-col lg:w-1/3 w-full">
                <div className="flex flex-col justify-center items-center gap-12 lg:gap-20">
                  <img
                    src="http://dummyimage.com/200x200"
                    className="w-64 rounded-2xl shadow-xl animate-pop rotate-8"
                  />

                  <img
                    src="http://dummyimage.com/200x200"
                    className="w-64 rounded-2xl shadow-xl animate-pop -rotate-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
