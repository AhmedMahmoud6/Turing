import {
  Cpu,
  Binary,
  Sparkles,
  CircuitBoard,
  Computer,
  Gpu,
  Code,
} from "lucide-react";

export function ThemeSection() {
  return (
    <section className="py-24 bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hexagon-pattern" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-6">
                2026
              </span>
              <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-6">
                <span className="text-primary">TURING</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Named after Alan Turing, the father of theoretical computer
                science and artificial intelligence, our theme explores the
                fascinating intersection of human creativity and machine
                intelligence.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                TURING invites us to question what it means to think, to create,
                and to be intelligent. From breakthrough AI technologies to the
                philosophical implications of thinking machines, we'll explore
                how the boundaries between human and artificial intelligence are
                evolving.
              </p>

              {/* Theme Keywords */}
              <div className="flex flex-wrap gap-3">
                {[
                  "Artificial Intelligence",
                  "Logic & Reasoning",
                  "Human Creativity",
                  "Future Tech",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-heading font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Central Circle */}
                <div
                  className="absolute inset-8 rounded-full border-2 border-primary/30 animate-spin"
                  style={{ animationDuration: "20s" }}
                />
                <div
                  className="absolute inset-16 rounded-full border border-primary/20 animate-spin"
                  style={{
                    animationDuration: "15s",
                    animationDirection: "reverse",
                  }}
                />
                <div className="absolute inset-24 rounded-full bg-primary/10 backdrop-blur-xl flex items-center justify-center">
                  <Cpu className="w-16 h-16 text-primary animate-pulse" />
                </div>

                {/* Floating Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center animate-float">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div
                    className="w-16 h-16 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-16 h-16 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center animate-float"
                    style={{ animationDelay: "2s" }}
                  >
                    <CircuitBoard className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-16 h-16 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center animate-float"
                    style={{ animationDelay: "3s" }}
                  >
                    <Binary className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
