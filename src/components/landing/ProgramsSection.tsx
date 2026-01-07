import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Workshop = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  location?: string;
  templateId?: string;
  whatsapp_group?: string;
};

export const workshops: Workshop[] = [
  {
    id: "w1",
    title: "Intro to AI for Developers",
    start: "2025-12-31T10:00:00",
    end: "2026-01-05T13:00:00",
    location: "Online",
    templateId: "template_2k1eqrh",
    whatsapp_group: "https://chat.whatsapp.com/EoZcV358n5VE9xJLMFaL50",
  },
  {
    id: "w2",
    title: "Level Up with TEDx ITech",
    start: "2026-01-16T10:00:00",
    end: "2026-01-23T13:00:00",
    location: "Online",
    templateId: "template_2k1eqrh",
    whatsapp_group: "https://chat.whatsapp.com/EoZcV358n5VE9xJLMFaL50",
  },
];

function getStatus(startIso: string, endIso: string) {
  const now = new Date();
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Ongoing";
  return "Ended";
}

export function ProgramsSection() {
  const navigate = useNavigate();

  return (
    <section
      id="programs"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
            Programs
          </span>
          <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
            Workshops & Programs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hands-on sessions you can join during TURING 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workshops.map((w) => {
            const status = getStatus(w.start, w.end);

            return (
              <div
                key={w.id}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 glow-border"
              >
                <div className="mb-4">
                  <h3 className="font-heading text-xl font-bold mb-1">
                    {w.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{w.location}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm">
                    {new Date(w.start).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <p className="mb-4 font-medium">
                  Status:{" "}
                  <span
                    className={
                      status === "Ended"
                        ? "text-destructive"
                        : status === "Ongoing"
                        ? "text-emerald-500"
                        : "text-primary"
                    }
                  >
                    {status}
                  </span>
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/register/${w.id}`)}
                    disabled={status === "Ended" || status === "Ongoing"}
                  >
                    Register
                  </Button>
                </div>

                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
