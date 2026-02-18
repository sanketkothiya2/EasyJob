'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Bookmark,
  ListChecks,
  BarChart3,
  FileText,
  Users,
  Bell,
} from 'lucide-react';

const features = [
  {
    icon: <Bookmark className="w-6 h-6" />,
    title: 'Bookmark Jobs',
    description: 'Save interesting job postings from anywhere and organize them in one place.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <ListChecks className="w-6 h-6" />,
    title: 'Track Progress',
    description: 'Follow your applications through 6 stages from bookmarked to accepted.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Visual Pipeline',
    description: 'See all your applications at a glance with our beautiful pipeline view.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Notes & Documents',
    description: 'Keep notes, resumes, and documents organized for each application.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Contact Management',
    description: 'Store recruiter and hiring manager contacts for easy follow-ups.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Deadline Reminders',
    description: 'Never miss an application deadline or follow-up opportunity.',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your job search and help you land your dream role.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Add Your Jobs',
      description: 'Easily add job listings you want to apply for. Copy the URL or manually enter the details.',
      image: '/images/illustrations/onboarding/step-1.png',
    },
    {
      number: '02',
      title: 'Track Your Progress',
      description: 'Move jobs through your pipeline as you apply, interview, and negotiate offers.',
      image: '/images/illustrations/onboarding/step-2.png',
    },
    {
      number: '03',
      title: 'Celebrate Success',
      description: "When you land the job, we'll celebrate with you! Export your journey and start fresh.",
      image: '/images/illustrations/success/celebration.png',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-pink-50">
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
            Three simple steps to organize your job search and land your dream role.
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
                <Image
                  src={step.image}
                  alt={step.title}
                  width={500}
                  height={400}
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
