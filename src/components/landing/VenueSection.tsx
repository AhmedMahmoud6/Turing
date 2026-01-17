import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VenueSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
              Location
            </span>
            <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
              The <span className="text-primary">Venue</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center h-full object-cover">
                  <img
                    src="/majarrah mall.jpeg"
                    className="h-full object-cover"
                    alt="Greek Campus"
                  />
                </div>
              </div>
            </div>

            {/* Venue Info */}
            <div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-6">
                Majarrah Mall
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Majarrah Mall is a mixed-use retail destination in Sheikh Zayed
                City, offering shopping, dining, entertainment, and office
                spaces in a modern, accessible setting serving west Cairo.
              </p>

              {/* Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-medium">Address</p>
                    <p className="text-muted-foreground">
                      Majarrah Mall, Sheikh Zayed City, Egypt
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-medium">Event Hours</p>
                    <p className="text-muted-foreground">
                      9:00 AM – 8:00 PM, February 6th, 2026
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/F637WvVKhSgyHcTv9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
