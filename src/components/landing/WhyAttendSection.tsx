import { Sparkles, Users, Palette, Brain, Zap, Globe } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "Inspiration",
    description: "Discover groundbreaking ideas from thought leaders across diverse fields.",
  },
  {
    icon: Users,
    title: "Networking",
    description: "Connect with innovators, entrepreneurs, and like-minded individuals.",
  },
  {
    icon: Palette,
    title: "Creative Experience",
    description: "Immerse yourself in artistic performances and interactive installations.",
  },
  {
    icon: Brain,
    title: "AI Theme",
    description: "Explore the cutting-edge intersection of human creativity and artificial intelligence.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Witness breakthrough technologies and visionary concepts in action.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Gain insights from a diverse lineup of international speakers.",
  },
];

export function WhyAttendSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
            Experience
          </span>
          <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
            Why <span className="text-primary">Attend?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            TURING offers an unforgettable experience that will inspire, challenge, and transform your perspective.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 glow-border"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <reason.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{reason.description}</p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
