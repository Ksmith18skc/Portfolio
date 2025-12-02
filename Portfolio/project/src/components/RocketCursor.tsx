import { useEffect, useRef, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailPoint extends CursorPosition {
  id: string;
  opacity: number;
}

export function RocketCursor() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const flameRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/touch screen
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        window.innerWidth <= 768;
      setIsMobile(isTouchDevice);
      document.body.style.cursor = isTouchDevice ? 'auto' : 'none';
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateCursorPosition = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (flameRef.current) {
        flameRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY + 25}px) scale(1.2)`;
      }

      setTrail((prevTrail) => {
        const newTrail = [
          {
            x: e.clientX,
            y: e.clientY + 25,
            id: `${Date.now()}-${Math.random()}`,
            opacity: 1
          },
          ...prevTrail.slice(0, 10),
        ].map((point) => ({
          ...point,
          opacity: point.opacity * 0.8,
        }));

        return newTrail;
      });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="cursor-container">
      {trail.map((point) => (
        <div
          key={point.id}
          className="cursor-trail"
          style={{
            left: point.x,
            top: point.y,
            opacity: point.opacity,
            backgroundColor: `rgba(255, ${Math.floor(point.opacity * 100)}, ${Math.floor(point.opacity * 50)}, ${point.opacity})`,
          }}
        />
      ))}
      <div className="rocket-cursor" ref={cursorRef}>
        🚀
      </div>
      <div className="rocket-flame" ref={flameRef}></div>
    </div>
  );
}