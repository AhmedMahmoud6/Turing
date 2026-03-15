import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function InnovateXSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
              <svg
                viewBox="0 0 100 100"
                className="w-16 h-16 text-background"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#g)" />
                <text
                  className="select-none"
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto"
                  fontWeight="700"
                  fontSize="36"
                  fill="white"
                >
                  IX
                </text>
              </svg>
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            InnovateX — A Hackathon by TURING
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join InnovateX: an ideas-to-prototype competition where you build
            solutions to real problems. Open to students and early-career
            builders. Register now to participate in Stage 1.
          </p>

          {/* <div className="flex justify-center">
            <Link to="/innovatex/rules">
              <Button
                variant="default"
                size="xl"
                className="group max-[450px]:w-full"
              >
                Rules for InnovateX
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
}
