'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';

export default function CTA() {
  const { data: session } = useSession();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const leftBlobY = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const rightBlobY = useTransform(scrollYProgress, [0, 1], [30, -25]);

  const outcomes = [
    'Track every application stage clearly',
    'Execute daily actions with confidence',
    'Keep resources organized for interviews',
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-pink relative overflow-hidden">
      <motion.div style={{ y: leftBlobY }} className="absolute -left-16 top-10 w-56 h-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <motion.div style={{ y: rightBlobY }} className="absolute -right-16 bottom-10 w-56 h-56 rounded-full bg-fuchsia-300/25 blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Run Your Job Search Like a Pro?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            From finding opportunities to completing interviews, EasyJob helps you execute every step
            with momentum and clarity.
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid md:grid-cols-3 gap-3 mb-8 text-left"
          >
            {outcomes.map((item) => (
              <motion.div
                key={item}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white/15 border border-white/25 rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span className="text-sm text-white">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <Link href={session ? "/dashboard" : "/register"}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button
                size="lg"
                className="bg-white text-pink-600 hover:bg-gray-100 gap-2"
              >
                {session ? 'Go to Dashboard' : 'Start Tracking Free'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo/logo.png"
                alt="EasyJob"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">EasyJob</span>
            </Link>
            <p className="text-gray-400 text-sm">
              The modern command center for job applications, execution tasks, and resources.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white">How it Works</Link></li>
              <li><Link href="/register" className="hover:text-white">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EasyJob. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
