'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const particles = [
  { left: '8%', top: '18%', size: 7, delay: 0 },
  { left: '16%', top: '68%', size: 9, delay: 0.5 },
  { left: '28%', top: '36%', size: 6, delay: 0.2 },
  { left: '34%', top: '82%', size: 8, delay: 0.8 },
  { left: '42%', top: '26%', size: 10, delay: 0.1 },
  { left: '51%', top: '56%', size: 7, delay: 0.4 },
  { left: '61%', top: '74%', size: 8, delay: 0.7 },
  { left: '69%', top: '22%', size: 9, delay: 0.3 },
  { left: '76%', top: '44%', size: 6, delay: 0.6 },
  { left: '83%', top: '64%', size: 10, delay: 0.9 },
  { left: '90%', top: '30%', size: 7, delay: 0.2 },
  { left: '12%', top: '90%', size: 6, delay: 1.1 },
];

export default function AnimatedBackground() {
  const { scrollY } = useScroll();

  const orbOneY = useTransform(scrollY, [0, 1000], [0, 140]);
  const orbTwoY = useTransform(scrollY, [0, 1000], [0, -100]);
  const beamY = useTransform(scrollY, [0, 1000], [0, 80]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 opacity-80"
        animate={{
          backgroundPosition: ['0% 0%', '100% 50%', '0% 100%'],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(244,114,182,0.17), transparent 35%), radial-gradient(circle at 80% 15%, rgba(129,140,248,0.12), transparent 30%), radial-gradient(circle at 70% 75%, rgba(236,72,153,0.12), transparent 38%), linear-gradient(180deg, #fffafc 0%, #fdf7fb 42%, #fbf8ff 100%)',
          backgroundSize: '170% 170%',
        }}
      />

      <motion.div
        style={{ y: orbOneY }}
        className="absolute -top-28 -left-20 w-[34rem] h-[34rem] rounded-full bg-pink-300/20 blur-3xl"
      />
      <motion.div
        style={{ y: orbTwoY }}
        className="absolute top-[22%] -right-28 w-[30rem] h-[30rem] rounded-full bg-indigo-300/20 blur-3xl"
      />

      <motion.div
        style={{ y: beamY }}
        className="absolute inset-x-0 top-[28%] h-[26rem] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[-7deg] blur-2xl"
      />

      <div className="absolute inset-0 opacity-70">
        {particles.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            className="absolute rounded-full bg-gradient-to-br from-pink-400/50 to-fuchsia-400/45"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.25, 0.75, 0.25],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.24)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.16]" />
    </div>
  );
}
