'use client'

import { useEffect, useState } from "react";

export default function AIModeButton() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let rafId;
    const step = () => {
      setAngle((a) => (a + 0.6) % 360); // tweak speed if needed
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const gradientStops =
    "#f63b35 0%, #f63b35 3%, #1265f0 7%, #477dff 17%, #2caf4f 20%, #72bb44 25%, #ffe523 27%, #ffcc25 30%, #ea4335 33%, #ea4335 45%, #1265f0 49%, #477dff 68%, #34a853 72%, #2caf4f 79%, #ffe523 82%, #ffcc25 87%, #f63b35 90%, #f63b35 100%";

  const wrapperStyle = {
    border: "3px solid transparent",
    borderRadius: "9999px",
    background: `linear-gradient(#fff,#fff) padding-box, conic-gradient(from ${angle}deg, ${gradientStops}) border-box`,
    willChange: "background",
  };

  return (
    <div
      style={wrapperStyle}
      className="inline-flex rounded-full transition-shadow duration-200 hover:shadow-md"
    >
      <button
        type="button"
        aria-pressed="false"
        aria-label="Open AI Mode"
        className={`
          inline-flex items-center justify-center
          h-[28px] px-[16px]
          rounded-full
          bg-transparent text-[#202124]
          font-[500] text-[14px] leading-[20px] font-sans
          cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-300
          transition-colors transition-transform duration-150
          hover:bg-gray-50
          active:translate-y-[0.5px]
        `}
      >
        Lucid
      </button>
    </div>
  );
}
