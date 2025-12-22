import { Brain, Lightbulb, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
              About Us
            </span>
            <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-6">
              TEDx<span className="text-primary">ITechSchoolYouth</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              TEDxITechSchoolYouth is an independently organized TED event that brings together 
              young innovators, thinkers, and creators to share ideas worth spreading. 
              We believe in the power of youth to shape the future through bold ideas and creative solutions.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 glow-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Ideas Worth Spreading</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover groundbreaking ideas from diverse fields including technology, science, arts, and social innovation.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 glow-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Youth Innovation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Empowering the next generation of leaders and thinkers to share their unique perspectives and solutions.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 glow-border">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Community Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Building a community of curious minds dedicated to making a positive impact on society and the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
