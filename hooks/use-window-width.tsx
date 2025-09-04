'use client'

import { useState, useEffect } from "react";

export default function useWindowWidth() {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Set width on mount
    setWidth(window.innerWidth);

    // Handler to call on resize
    function handleResize() {
      setWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
