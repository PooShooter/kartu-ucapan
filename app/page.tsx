"use client";

import { useState, useRef, useEffect } from "react";
import { FaGift } from "react-icons/fa6";
import { Fireworks } from "@fireworks-js/react";
import ParticleEngine from "@/components/ParticleEngine.jsx";

export default function Home() {
  const [isFading, setIsFading] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const particleEngine = useRef<any>(null);

  const canClick = useRef(true);
  const lastText = useRef<string | null>(null);
  const texts = [
    "Happy Birthday!",
    "I Love You!",
    "Sehat Selalu!",
    "Bahagia Terus!",
    "Makin Sukses!",
    "Love You Always!",
    "Wish You The Best!",
  ];

  
  
  const launchIntroFirework = () => {
    particleEngine.current?.launchRocket();

    setTimeout(() => {
      setShowFireworks(true);
    }, 4500);
  };

  const bgClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
      }, 7000);
    }, 500);
  };

  return (
    <div
      onClick={showSurprise ? bgClick : undefined}
      className="min-h-dvh overflow-hidden bg-black"
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
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 md:px-24 gap-5">
        {showCard && (
          <div
            id="card"
            className={`flex flex-col items-center justify-center gap-5 transition-all duration-500 ${
              isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <h1 className="animate-pulse text-center text-5xl md:text-7xl font-bold text-[#00ffc0] drop-shadow-[0_0_15px_rgba(0,255,192,.8)]">
              Happy Birthday!
            </h1>

            <FaGift
              onClick={handleClick}
              className="animate-bounce text-5xl md:text-7xl text-[#eeff00] drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] mt-4 hover:cursor-pointer active:text-6xl md:hover:text-8xl duration-300"
            />

            <p className="mt-4 text-center text-sm md:text-lg font-semibold">
              Click the gift for a surprise!
            </p>
          </div>
        )}
        {showSurprise && !showPopup && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => setShowPopup(true)}
              className="text-white border-2 border-white rounded-3xl bg-white/25 hover:cursor-pointer active:bg-white md:hover:bg-white active:text-black md:hover:text-black active:drop-shadow-[0_0_15px_rgba(255,255,255)] md:hover:drop-shadow-[0_0_15px_rgba(255,255,255)] px-6 py-3"
            >
              Show Special Message ✨
            </button>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm z-50">
          <div className="min-h-dvh flex justify-center items-center px-4 py-4">
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
                  className="w-full text-gray-300 font-semibold underline mt-10 hover:cursor-pointer active:text-gray-400 md:hover:text-gray-400 active:font-bold md:hover:font-bold"
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
