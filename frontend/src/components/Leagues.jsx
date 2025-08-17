import React, { useRef, useEffect, useState } from 'react';

// Simple className utility if cn is not available
const cn = (...classes) => classes.filter(Boolean).join(' ');

// ScrollFadeIn component without TypeScript
const ScrollFadeIn = ({ children, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const leagues = [
  { name: 'Royal London Cup', logo: '/rw.jpg' },
  { name: 'Big Bash League', logo: '/bb.jpg' },
  { name: 'IPL', logo: '/TL.png' },
  { name: 'The Hundred', logo: '/th.png' },
  { name: 'The Women\'s Hundred', logo: '/thw.jpeg' },
  { name: 'The Ashes', logo: '/ashes.jpg' },
  { name: 'ICC World Cup', logo: '/icc.jpg' },
  { name: 'PSL', logo: '/psl.png' },
  { name: 'Test Series', logo: '/test.jpg' },
  { name: 'Super Smash', logo: '/ss.png' },
  { name: 'T20 Blast', logo: '/t20.jpg' },
  { name: 'CPL', logo: '/cpl.jpg' },
];

export default function Leagues() {
  const extendedLeagues = [...leagues, ...leagues]; // Duplicate for seamless loop

  return (
    <section id="leagues" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <ScrollFadeIn delay={100}>
          <h2 className="text-3xl md:text-4xl font-bold text-red-500 mb-4">Cricket Leagues</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Explore top cricket leagues with exciting matches and global talent.
          </p>
        </ScrollFadeIn>
        <div className="relative w-full overflow-hidden group">
          <div className="animate-infinite-scroll group-hover:pause flex w-max">
            {extendedLeagues.map((league, index) => (
              <div key={index} className="flex-shrink-0 w-64 md:w-80 h-24 flex items-center justify-center gap-4 mx-4">
                <img
                  src={league.logo}
                  alt={league.name}
                  className="max-h-12 w-auto object-contain"
                  onError={(e) => (e.target.src = '/icc.jpg')}
                />
                <span className="text-2xl md:text-3xl font-bold text-gray-900 whitespace-nowrap">
                  {league.name}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-transparent to-white pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}