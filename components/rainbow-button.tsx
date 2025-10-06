'use client'

import { useEffect, useState } from "react";

export default function AIModeButton() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let rafId: number;
    const step = () => {
      setAngle((a) => (a + 0.2) % 360);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const gradientStops =
    "#f63b35 0%, #f63b35 3%, #1265f0 7%, #477dff 17%, #2caf4f 20%, #72bb44 25%, #ffe523 27%, #ffcc25 30%, #ea4335 33%, #ea4335 45%, #1265f0 49%, #477dff 68%, #34a853 72%, #2caf4f 79%, #ffe523 82%, #ffcc25 87%, #f63b35 90%, #f63b35 100%";

  const wrapperStyle = {
    border: "2px solid transparent",
    borderRadius: "9999px",
    background: `linear-gradient(#000, #000) padding-box, conic-gradient(from ${angle}deg, ${gradientStops}) border-box`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    willChange: "background",
  };

  return (
    <div
      style={wrapperStyle}
      className="inline-flex rounded-full relative overflow-hidden"
    >
      <button
        type="button"
        aria-pressed="false"
        aria-label="Lucid"
        className={`
          relative inline-flex items-center justify-center
          h-[28px] px-[12px]
          rounded-full
          bg-black text-white
          font-[500] text-[14px] leading-[20px] font-sans
          cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-300
          transition-colors duration-150
          overflow-hidden
        `}
      >
        {/* shimmer overlay */}
        <span
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 60%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.5s infinite",
          }}
        />
        <span className="relative z-10">Lucid</span>
      </button>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
