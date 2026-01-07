import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ThemeSection } from "@/components/landing/ThemeSection";
import { SpeakersSection } from "@/components/landing/SpeakersSection";
import { ScheduleSection } from "@/components/landing/ScheduleSection";
import { WhyAttendSection } from "@/components/landing/WhyAttendSection";
import { VenueSection } from "@/components/landing/VenueSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { SponsorsSection } from "@/components/landing/SponsorsSection";
import { CTASection } from "@/components/landing/CTASection";
import { ProgramsSection } from "@/components/landing/ProgramsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ThemeSection />
        {/* <SpeakersSection /> */}
        {/* <ScheduleSection /> */}
        <WhyAttendSection />
        <ProgramsSection />
        <VenueSection />
        <TeamSection />
        <SponsorsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
