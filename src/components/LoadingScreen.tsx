import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="relative w-32 h-32">
        {/* Orbiting animation */}
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-4 border-4 border-b-accent rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Analyzing exoplanet candidates{dots}</h3>
        <p className="text-muted-foreground">This may take a few moments</p>
      </div>
    </div>
  );
};
