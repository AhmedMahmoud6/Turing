import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 circuit-bg opacity-30" />
      <div className="absolute inset-0 neural-lines" />

      {/* Animated Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center stagger-children">
          {/* Theme Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-heading text-sm font-medium text-primary uppercase tracking-wider">
              2026
            </span>
          </div>

          {/* Main Title */}
          <h1 className="flex justify-center items-center mb-6">
            <img
              src="/Asset 6.png"
              alt="Turing"
              className="max-w-[92vw] h-auto mx-auto"
            />
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light">
            Tech the leap, Shape the future
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-heading font-medium">6 Feb 2026</span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-foreground/80">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-heading font-medium">
                9:00 AM – 8:00 PM
              </span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-heading font-medium">
                The GrEEK Campus MOA
              </span>
            </div>
          </div>

          {/* CTAs */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tickets">
              <Button variant="hero" size="xl">
                Book Tickets
              </Button>
            </Link>
            <a href="#speakers">
              <Button variant="hero-outline" size="xl">
                Meet the Speakers
              </Button>
            </a>
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center animate-bounce">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs font-heading uppercase tracking-wider">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
