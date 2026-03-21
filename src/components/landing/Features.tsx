'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BriefcaseBusiness,
  CheckSquare,
  BookOpenText,
  Workflow,
  CalendarCheck2,
  FolderKanban,
  Bell,
  Rocket,
} from 'lucide-react';

const modules = [
  {
    icon: <BriefcaseBusiness className="w-6 h-6" />,
    title: 'Jobs Hub',
    description: 'Track every application in one timeline with status updates, contacts, and notes.',
    bullets: ['Pipeline stages', 'Recruiter contacts', 'Interview notes'],
    color: 'from-pink-500 to-rose-500',
    light: 'bg-pink-50 text-pink-600',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Tasks Command Center',
    description: 'Turn job goals into action with dashboard, calendar, and kanban execution views.',
    bullets: ['Daily/weekly/monthly goals', 'Kanban flow', 'Completion analytics'],
    color: 'from-blue-500 to-indigo-500',
    light: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <BookOpenText className="w-6 h-6" />,
    title: 'Resources Vault',
    description: 'Save links, docs, screenshots, and references so context is always one click away.',
    bullets: ['Organized library', 'Quick search', 'Application-linked resources'],
    color: 'from-purple-500 to-fuchsia-500',
    light: 'bg-purple-50 text-purple-600',
  },
];

const capabilities = [
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Unified Workflow',
    description: 'From application tracking to execution planning in one connected product.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: <CalendarCheck2 className="w-6 h-6" />,
    title: 'Deadline Discipline',
    description: 'Plan and complete high-impact tasks before opportunities go cold.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: <FolderKanban className="w-6 h-6" />,
    title: 'Visual Control',
    description: 'Use board and timeline views to keep priorities visible and moving.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Smart Reminders',
    description: 'Never miss follow-ups, interviews, and prep tasks in your week.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Execution Velocity',
    description: 'Ship more applications and make better decisions with clear daily focus.',
    color: 'bg-rose-100 text-rose-600',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const orbLeftY = useTransform(scrollYProgress, [0, 1], [-30, 45]);
  const orbRightY = useTransform(scrollYProgress, [0, 1], [20, -30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={sectionRef} id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(244,114,182,0.1),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(129,140,248,0.1),transparent_30%)]" />
      <motion.div style={{ y: orbLeftY }} className="absolute -top-14 -left-8 w-56 h-56 rounded-full bg-pink-100/70 blur-3xl" />
      <motion.div style={{ y: orbRightY }} className="absolute top-10 -right-8 w-60 h-60 rounded-full bg-indigo-100/70 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Operating System for Your{' '}
            <span className="gradient-text">Job Search</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            EasyJob v2 combines Jobs, Tasks, and Resources into one execution layer so every day
            moves you closer to an offer.
          </p>
        </motion.div>

        {/* Product Modules */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid lg:grid-cols-3 gap-6 mb-16"
        >
          {modules.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.03 }}
              whileHover={{ y: -6 }}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.light} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.bullets.map((point) => (
                  <li key={point} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Capability Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {capabilities.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.03 }}
              className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Capture Opportunities',
      description: 'Save target roles into your pipeline with source links, notes, and excitement score.',
      image: '/images/illustrations/onboarding/step-1.png',
    },
    {
      number: '02',
      title: 'Plan Your Execution',
      description: 'Create daily, weekly, and monthly tasks directly from opportunities and priorities.',
      image: '/images/illustrations/onboarding/step-2.png',
    },
    {
      number: '03',
      title: 'Ship Consistently',
      description: 'Use dashboard, calendar, and kanban views to keep momentum and finish what matters.',
      image: '/images/illustrations/success/celebration.png',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple production-ready workflow to convert opportunities into outcomes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1">
                <span className="text-6xl font-bold text-pink-100">{step.number}</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1">
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={500}
                    height={400}
                    className="w-full max-w-md mx-auto rounded-2xl shadow-lg border border-white"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
