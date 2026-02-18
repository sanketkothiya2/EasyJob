import { Navbar, Hero, Features, HowItWorks, CTA, Footer } from '@/components/landing';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
