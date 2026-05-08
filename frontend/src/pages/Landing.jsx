import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Visualization from "../components/Visualization";
import Architecture from "../components/Architecture";
import AIAnalysis from "../components/AIAnalysis";
import Features from "../components/Features";
import WhyMatters from "../components/WhyMatters";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="relative bg-[var(--bg)]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Visualization />
      <Architecture />
      <AIAnalysis />
      <Features />
      <WhyMatters />
      <FinalCTA />
      <Footer />
    </main>
  );
}
