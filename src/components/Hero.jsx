import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center z-30 text-black bg-no-repeat"
      style={{ backgroundImage: "url('/bg-image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 -z-10"></div>
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-4xl text-black md:text-5xl font-extrabold leading-tight">
              Your One‑Stop Shop for Everything
            </h1>
            <p className="mt-4 text-black text-lg">
              Fashion, Grocery, Shoes, Medicine, Electronics, Books, Sports, and
              Beauty — discover deals across all categories with one universal
              search.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 z-30 w-full">
              <button className="cursor-pointer items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-white/90">
                Start Exploring
              </button>
              <button
                onClick={() => console.log("click")}
                className="cursor-pointer items-center gap-2 px-4 py-2.5 rounded-xl border border-white/50 text-black font-semibold hover:bg-blue-500/10"
              >
                View Deals
              </button>
            </div>
          </div>
          {/* <div className="glass rounded-3xl p-5 md:p-6 soft-shadow">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
                <div className="rounded-2xl bg-white/70 dark:bg-white/10 h-28"></div>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Modern UI with glassmorphism and smooth interactions.
              </p>
            </div> */}
        </div>
      </div>
    </section>
  );
}

export default Hero;
