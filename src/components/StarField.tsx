import { useEffect, useRef } from 'react';

export const StarField = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Generate random stars
    const starCount = 100;
    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 3}s`;
      
      // Some stars glow
      if (Math.random() > 0.7) {
        star.classList.add('star-glow');
      }

      canvasRef.current.appendChild(star);
      stars.push(star);
    }

    // Cleanup
    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
