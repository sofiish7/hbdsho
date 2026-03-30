import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const GalaxyBackground: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: string; color: string }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: number; left: number; size: number; duration: number; angle: number }[]>([]);
  const [planets, setPlanets] = useState<{ id: number; x: number; y: number; size: number; color: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const starColors = ['#ffffff', '#fff4e6', '#e6f4ff', '#f4e6ff', '#fff0f0'];
    const newStars = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: (Math.random() * 3 + 2) + 's',
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
    setStars(newStars);

    const planetColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9f43', '#a29bfe'];
    const newPlanets = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 40 + 20,
      color: planetColors[i % planetColors.length],
      duration: (Math.random() * 20 + 20) + 's',
      delay: (Math.random() * -20) + 's',
    }));
    setPlanets(newPlanets);

    const interval = setInterval(() => {
      const id = Date.now();
      const duration = Math.random() * 2000 + 3000; // 3s to 5s (slower)
      const angle = Math.random() * 360;
      
      // Randomize starting position on the screen
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      setShootingStars(prev => [...prev, { 
        id, 
        top, 
        left,
        size: Math.random() * 1.5 + 0.5,
        duration,
        angle
      }]);
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, duration);
    }, 4000); // 4 second gaps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="galaxy-bg">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.color,
            '--duration': star.duration,
          } as any}
        />
      ))}
      
      {planets.map(planet => (
        <motion.div
          key={planet.id}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: parseInt(planet.duration),
            repeat: Infinity,
            ease: "linear",
            delay: parseInt(planet.delay),
          }}
          className="absolute rounded-full blur-[1px] opacity-40"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            background: `radial-gradient(circle at 30% 30%, ${planet.color}, transparent)`,
            boxShadow: `0 0 20px ${planet.color}44`,
          }}
        />
      ))}

      {shootingStars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            '--angle': `${star.angle}deg`,
            '--scale': star.size,
            '--shooting-duration': `${star.duration}ms`,
          } as any}
        />
      ))}
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
    </div>
  );
};
