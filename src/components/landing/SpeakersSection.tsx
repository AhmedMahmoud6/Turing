import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const speakers = [
  { id: 1, name: "Dr. Sarah Chen", title: "The Future of Neural Networks", role: "AI Researcher" },
  { id: 2, name: "Marcus Williams", title: "Creativity in the Age of Machines", role: "Creative Director" },
  { id: 3, name: "Aisha Patel", title: "Ethics in Artificial Intelligence", role: "Tech Ethicist" },
  { id: 4, name: "James Okonkwo", title: "Building Tomorrow's Algorithms", role: "Software Engineer" },
  { id: 5, name: "Elena Volkov", title: "Human-AI Collaboration", role: "UX Researcher" },
  { id: 6, name: "David Kim", title: "The Art of Machine Learning", role: "Data Scientist" },
  { id: 7, name: "Fatima Al-Hassan", title: "Democratizing AI Education", role: "Educator" },
  { id: 8, name: "Alex Rivera", title: "Startups in the AI Era", role: "Entrepreneur" },
  { id: 9, name: "Dr. Michael Foster", title: "Quantum Computing Horizons", role: "Physicist" },
  { id: 10, name: "Grace Nakamura", title: "AI in Healthcare", role: "Medical Technologist" },
  { id: 11, name: "Omar Hassan", title: "Language Models Unveiled", role: "NLP Specialist" },
  { id: 12, name: "Lisa Chang", title: "Robotics Revolution", role: "Robotics Engineer" },
];

export function SpeakersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="speakers" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
              Speakers
            </span>
            <h2 className="font-heading text-display-sm md:text-display-md font-bold">
              Meet Our <span className="text-primary">Speakers</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Speakers Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className="flex-shrink-0 w-72 snap-start group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border group-hover:border-primary/50 transition-all duration-300">
                {/* Speaker Photo Placeholder */}
                <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-heading text-2xl font-bold text-primary">
                        {speaker.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  
                  {/* Speaker Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-heading">
                      {speaker.role}
                    </p>
                    <h3 className="font-heading text-lg font-bold mb-2">
                      {speaker.name}
                    </h3>
                    <p className="text-sm text-background/80 line-clamp-2">
                      "{speaker.title}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}