import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 circuit-bg opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-heading text-sm font-medium text-primary uppercase tracking-wider">
              Limited Seats Available
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-6">
            Be part of the <span className="text-primary">TURING</span>{" "}
            experience
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join us on February 6th, 2026 for a day of inspiration, innovation,
            and unforgettable ideas.
          </p>

          {/* CTA Button */}
          <Link to="/tickets">
            <Button
              variant="hero"
              size="xl"
              className="max-[450px]:w-full group"
            >
              Book Your Tickets Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-muted-foreground">
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">
                Feb 6
              </p>
              <p className="text-sm">2026</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">
                9 AM
              </p>
              <p className="text-sm">to 8 PM</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">
                GrEEK Campus
              </p>
              <p className="text-sm">Mall of Arabia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
