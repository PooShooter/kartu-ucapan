"use client";

import { useState } from "react";
import { FaGift } from "react-icons/fa6";

export default function Home() {
  const [isFading, setIsFading] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleClose = () => {
  window.location.reload();
};

  const handleClick = () => {
    setIsFading(true);

    // Wait for fade-out animation
    setTimeout(() => {
      setShowCard(false);

      // Wait another second before showing surprise
      setTimeout(() => {
        setShowSurprise(true);
      }, 5000);
    }, 500);
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col min-h-screen items-center justify-center p-24 gap-5">
        {showCard && (
          <div
            id="card"
            className={`flex flex-col items-center justify-center gap-5 transition-all duration-500 ${
              isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <h1 className="animate-pulse text-5xl text-[#00ffc0] drop-shadow-[0_0_15px_rgba(0,255,192,0.8)] font-bold">
              Happy Birthday!
            </h1>

            <FaGift
              onClick={handleClick}
              className="animate-bounce text-6xl text-[#eeff00] drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] mt-4 hover:cursor-pointer hover:text-7xl duration-300"
            />

            <p className="mt-4 font-semibold">
              Click the gift for a surprise!
            </p>
          </div>
        )}
        {showSurprise && !showPopup && (
          <div className="mt-auto pb-10">
              <button onClick={() => setShowPopup(true)} className="text-white border-2 border-white rounded-3xl bg-white/25 hover:cursor-pointer hover:bg-white hover:text-black hover:drop-shadow-[0_0_15px_rgba(255,255,255)] px-6 py-3">
                Show Special Message ✨
              </button>
          </div>
        )}
      </div>
      {showPopup && (
  <div className="fixed inset-0 flex flex-row items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="flex items-center gap-6">
          <div className="w-1/3 flex flex-col items-center gap-16">
            <div className="w-1/3">
              <img
              src="http://dummyimage.com/200x200"
              alt="Birthday"
              className="w-48 rounded-2xl shadow-xl animate-pop ml-12 -rotate-20"
              />
            </div>
            <div className="w-1/3">
              <img
              src="http://dummyimage.com/200x200"
              alt="Birthday"
              className="w-48 rounded-2xl shadow-xl animate-pop ml-0 rotate-6"
              />
            </div>
              <div className="w-1/3">
              <img
              src="http://dummyimage.com/200x200"
              alt="Birthday"
              className="w-48 rounded-2xl shadow-xl animate-pop ml-24 -rotate-9"
              />
            </div>
          </div>
          <div className="w-1/3 animate-pop bg-gray-900/50 text-white rounded-2xl border border-gray-700/50 p-8
            shadow-xl
            transition-all duration-300
            scale-100 opacity-100">
            <h2 className="text-3xl text-center font-bold mb-4">
              🎉 Happy Birthday (YOUR NAME) 🎉
            </h2>
            <div className="space-y-3 text-center">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae impedit sunt qui accusantium sint, aperiam natus a aliquid eaque magni deleniti quia perspiciatis adipisci velit quasi enim et, voluptatibus temporibus ab explicabo error in id fugiat facere? Tenetur magnam magni velit voluptates ut sunt explicabo illum error illo soluta esse, dolores natus necessitatibus corporis debitis, suscipit temporibus eaque asperiores delectus. Delectus a in provident repudiandae odio illo id expedita aperiam temporibus eius natus aut error maiores assumenda quis distinctio aspernatur, quisquam ratione odit vero fugit saepe harum! Nemo repudiandae quam ab iusto magni vitae facere reiciendis, exercitationem assumenda in consequuntur!</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full text-gray-300 font-semibold underline mt-10 hover:text-gray-400 hover:font-bold hover:cursor-pointer"
            >
              Start Again
            </button>
          </div>
          <div className="w-1/3 flex flex-col items-center gap-50">
            <div className="w-1/2">
              <img
              src="http://dummyimage.com/200x200"
              alt="Birthday"
              className="w-70 rounded-2xl shadow-xl animate-pop ml-12 rotate-10"
              />
            </div>
              <div className="w-1/2">
              <img
              src="http://dummyimage.com/200x200"
              alt="Birthday"
              className="w-70 rounded-2xl shadow-xl animate-pop ml-24 -rotate-9"
              />
            </div>
          </div>
    </div>
  </div>
)}
    </div>
  );
}