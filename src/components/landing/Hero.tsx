'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, BriefcaseBusiness, CheckSquare, BookOpenText } from 'lucide-react';
import { Button } from '@/components/ui';

export default function Hero() {
  const { data: session } = useSession();

  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [0, 2.2]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  const moduleCards = [
    {
      icon: BriefcaseBusiness,
      title: 'Jobs',
      description: 'Track every application stage from bookmark to offer.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: CheckSquare,
      title: 'Tasks',
      description: 'Plan daily, weekly, and monthly execution with focus.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: BookOpenText,
      title: 'Resources',
      description: 'Save links, notes, and docs that support every application.',
      color: 'from-purple-500 to-fuchsia-500',
    },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-0 w-[32rem] h-[32rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(244,114,182,0.14),transparent_40%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Built for real job search execution
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              From Job Hunt Chaos to{' '}
              <span className="gradient-text">Daily Momentum</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg"
            >
              EasyJob brings Jobs, Tasks, and Resources into one focused workspace so you can
              apply smarter, follow through consistently, and close offers faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href={session ? "/dashboard" : "/register"}>
                <Button size="lg" className="gap-2">
                  {session ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              {!session && (
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="grid sm:grid-cols-3 gap-3 mb-10"
            >
              {moduleCards.map((item) => (
                <div key={item.title} className="bg-white/90 backdrop-blur rounded-xl border border-white shadow-sm p-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-r ${item.color} text-white flex items-center justify-center mb-2`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8"
            >
              <div>
                <div className="text-3xl font-bold text-gray-900">20K+</div>
                <div className="text-sm text-gray-500">Applications Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">500K+</div>
                <div className="text-sm text-gray-500">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">3-in-1</div>
                <div className="text-sm text-gray-500">Jobs + Tasks + Resources</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative px-2"
            style={{ y: imageY }}
          >
            <div className="relative">
              <motion.div
                style={{ rotate: frameRotate }}
                className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-pink-300/30 via-fuchsia-200/20 to-indigo-300/30 blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="relative border border-white/70 shadow-[0_18px_45px_rgba(236,72,153,0.18)] bg-white/70 backdrop-blur-sm overflow-hidden"
                style={{
                  clipPath: 'polygon(0 9%, 9% 0, 91% 0, 100% 9%, 100% 91%, 91% 100%, 9% 100%, 0 91%)',
                }}
              >
                <motion.div
                  animate={{ x: ['-130%', '130%'] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.6 }}
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"
                />

                <motion.div style={{ scale: imageScale }} className="relative z-10">
                  <Image
                    src="/images/illustrations/hero/landing-hero.png"
                    alt="Job tracking dashboard illustration"
                    width={600}
                    height={500}
                    priority
                    className="w-full h-auto"
                  />
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.35, 0.6, 0.35] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(244,114,182,0.2),transparent_45%)] z-10"
                />
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-10 -right-8 w-20 h-20 rounded-full border border-pink-300/60"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-8 -left-10 w-16 h-16 rounded-full border border-indigo-300/60"
              />

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ y: badgeY }}
                className="absolute top-10 right-10 bg-white rounded-lg shadow-lg p-3 z-30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Application Sent!</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="absolute bottom-20 left-0 bg-white rounded-lg shadow-lg p-3 z-30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <span className="text-sm font-medium">Task Plan Generated!</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, delay: 0.4 }}
                className="absolute -bottom-6 right-6 bg-white rounded-lg shadow-lg p-3 z-30"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
                  <span className="font-medium">Resource saved to sprint board</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
