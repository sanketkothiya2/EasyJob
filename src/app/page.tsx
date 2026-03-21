import { AnimatedBackground, Navbar, Hero, Features, HowItWorks, CTA, Footer } from '@/components/landing';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
