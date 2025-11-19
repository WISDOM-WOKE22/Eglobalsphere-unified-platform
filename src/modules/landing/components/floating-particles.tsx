'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'circle' | 'square' | 'triangle';
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial particles
    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as
        | 'circle'
        | 'square'
        | 'triangle',
    }));

    setParticles(initialParticles);

    // Animation loop
    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.speedX *= -1;
            newX = particle.x + particle.speedX;
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.speedY *= -1;
            newY = particle.y + particle.speedY;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      opacity: particle.opacity,
      transition: 'all 0.1s ease-out',
    };

    switch (particle.type) {
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background:
                'linear-gradient(45deg, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.6))',
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.3)',
            }}
          />
        );
      case 'square':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background:
                'linear-gradient(45deg, rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6))',
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.3)',
              transform: 'rotate(45deg)',
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid rgba(59, 130, 246, 0.6)`,
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
      {particles.map(renderParticle)}
    </div>
  );
}
