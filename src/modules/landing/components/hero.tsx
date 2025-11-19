'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Hero() {
  const route = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Animated SVG Pattern Background */}
      <div className='absolute inset-0 opacity-20'>
        <svg
          className='w-full h-full'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1000 1000'
        >
          <defs>
            <pattern
              id='grid'
              width='50'
              height='50'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 50 0 L 0 0 0 50'
                fill='none'
                stroke='rgba(30,30,30,0.12)'
                strokeWidth='1'
              />
            </pattern>
            <radialGradient id='gradient1' cx='0.5' cy='0.5' r='0.5'>
              <stop offset='0%' stopColor='rgba(30,30,30,0.4)' />
              <stop offset='100%' stopColor='rgba(30,30,30,0)' />
            </radialGradient>
            <radialGradient id='gradient2' cx='0.5' cy='0.5' r='0.5'>
              <stop offset='0%' stopColor='rgba(255,255,255,0.4)' />
              <stop offset='100%' stopColor='rgba(255,255,255,0)' />
            </radialGradient>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />

          {/* Floating geometric shapes */}
          <circle
            cx='200'
            cy='200'
            r='4'
            fill='url(#gradient1)'
            className='animate-bounce'
            style={{
              animation: 'float 4s ease-in-out infinite',
            }}
          />
          <rect
            x='800'
            y='300'
            width='8'
            height='8'
            fill='url(#gradient2)'
            className='animate-spin'
            style={{
              animation: 'spin 6s linear infinite',
            }}
          />
          <polygon
            points='150,600 160,580 170,600 160,620'
            fill='url(#gradient1)'
            style={{
              animation: 'float 5s ease-in-out infinite',
            }}
          />
        </svg>
      </div>

      {/* Gradient orbs that follow mouse */}
      <div
        className='absolute w-96 h-96 bg-gradient-to-r from-gray-900/30 to-gray-100/30 rounded-full blur-3xl transition-transform duration-300 ease-out'
        style={{
          transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
        }}
      />
      <div
        className='absolute w-64 h-64 bg-gradient-to-r from-gray-100/30 to-gray-900/30 rounded-full blur-3xl transition-transform duration-500 ease-out'
        style={{
          transform: `translate(${mousePosition.x - 128 + 100}px, ${mousePosition.y - 128 - 100}px)`,
        }}
      />

      {/* Main content */}
      <div className='relative z-10 text-center px-5 max-w-6xl mx-auto mt-40'>
        <div className='space-y-8 animate-fade-in'>
          {/* Badge */}
          <div className='inline-flex items-center px-4 py-2 rounded-full bg-gray-900/10 backdrop-blur-sm border border-gray-600 animate-fade-in-up'>
            <span className='w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse'></span>
            <span className='text-sm font-medium text-gray-500'>
              Manage All Your Services,
            </span>
          </div>

          {/* Main heading */}
          <h1 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight animate-fade-in-up'>
            <span className='block bg-gradient-to-r from-gray-900 via-gray-100 to-gray-900 bg-clip-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl dark:text-gray-300'>
             Your Entire EglobalSphere Ecosystem
            </span>
            <span className='block text-transparent text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 dark:text-gray-300'>
              Unified
            </span>
            <span className='block text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 dark:text-gray-300'>
              in One Dashboard
            </span>
          </h1>

          {/* Description */}
          <p className='text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed animate-fade-in-up dark:text-gray-300'>
            Monitor services, manage licenses, access analytics, and handle support—seamlessly.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up mb-30'>
            <Button
              variant='outline'
              onClick={() =>
                route.push('/login')
              }
              className='group relative px-8 py-7 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-gray-900/25 animate-pulse'
            >
              <span className='relative z-10'>Get Started Today</span>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
            </Button>

            {/* <Button
              variant='outline'
              className='px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-900/30 text-gray-900 hover:bg-gray-900/10 backdrop-blur-sm transition-all duration-300'
            >
              Watch Demo
            </Button> */}
          </div>

          {/* Stats */}
          {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in-up'>
            {[
              { number: '50K+', label: 'Active Students' },
              { number: '95%', label: 'Success Rate' },
              { number: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <div
                key={index}
                className='text-center animate-fade-in-up'
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-900/60 text-sm md:text-base'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in'>
        <div className='w-6 h-10 border-2 border-gray-900/30 rounded-full flex justify-center animate-bounce'>
          <div className='w-1 h-3 bg-gray-900/60 rounded-full mt-2'></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.8;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
