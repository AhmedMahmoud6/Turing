import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const schedule = [
  { time: "8:00 AM", event: "Doors Open & Registration", type: "general" },
  { time: "9:00 AM", event: "Opening Ceremony", type: "highlight" },
  { time: "9:30 AM", event: "Session 1: AI Frontiers", type: "talk" },
  { time: "11:00 AM", event: "Coffee Break & Networking", type: "break" },
  { time: "11:30 AM", event: "Session 2: Human Connection", type: "talk" },
  { time: "1:00 PM", event: "Lunch Break", type: "break" },
  { time: "2:30 PM", event: "Session 3: Future Visions", type: "talk" },
  { time: "4:00 PM", event: "Interactive Performances", type: "performance" },
  { time: "5:30 PM", event: "Session 4: Closing Ideas", type: "talk" },
  { time: "7:00 PM", event: "Networking Reception", type: "general" },
  { time: "9:00 PM", event: "Closing Ceremony", type: "highlight" },
];

export function ScheduleSection() {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "highlight":
        return "bg-primary text-primary-foreground";
      case "talk":
        return "bg-primary/10 text-primary border border-primary/30";
      case "performance":
        return "bg-primary/20 text-primary border border-primary/40";
      case "break":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
              Schedule
            </span>
            <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
              Event <span className="text-primary">Timeline</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A full day of inspiring talks, performances, and networking opportunities.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[72px] md:left-24 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-6">
              {schedule.map((item, index) => (
                <div key={index} className="flex gap-6 items-center group">
                  {/* Time */}
                  <div className="w-16 md:w-20 text-right shrink-0">
                    <span className="font-heading text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.time}
                    </span>
                  </div>
                  
                  {/* Dot */}
                  <div className="relative z-10">
                    <div className={`w-3 h-3 rounded-full ${item.type === "highlight" ? "bg-primary animate-pulse" : "bg-border group-hover:bg-primary transition-colors"}`} />
                  </div>
                  
                  {/* Event */}
                  <div className={`flex-1 px-4 py-3 rounded-xl ${getTypeStyles(item.type)} transition-all duration-300 group-hover:shadow-card`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 opacity-60" />
                      <span className="font-heading font-medium">{item.event}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View Full Agenda
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}