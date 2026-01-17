import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tiers = [
  // {
  //   name: "Platinum",
  //   className: "tier-platinum",
  //   images: ["QNB.jpeg"],
  // },
  {
    name: "Gold",
    className: "tier-gold",
    images: ["/cardoo-blue.jpeg"],
  },
  {
    name: "Silver",
    className: "tier-silver",
    images: ["/toco.jpeg", "/Hamwi.png", "HireQ.png"],
  },
  {
    name: "Collaborators",
    className: "tier-inkind",
    images: ["shabab.png", "/eyoot.jpg", "f2a.png"],
  },
];

export function SponsorsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
            Partners
          </span>
          <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Partner with us to inspire the next generation of innovators.
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.name}>
              <h3 className="font-heading text-lg font-bold text-center mb-6 uppercase tracking-wider">
                {tier.name}{" "}
                <span className="text-muted-foreground font-normal">
                  {tier.name === "Collaborators" ? "" : "Partners"}
                </span>
              </h3>
              <div className={`flex justify-center gap-4 flex-wrap`}>
                {Array.from({ length: tier.images.length }).map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-video rounded-xl flex items-center justify-center ${tier.className} max-w-[150px] max-h-[150px] transition-all duration-300`}
                  >
                    <div className="text-center">
                      <img
                        src={tier.images[index]}
                        className="rounded-md max-w-[150px] max-h-[150px]"
                        alt="Logo"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Interested in sponsoring TURING 2026?
          </p>
          <Link to="/sponsors">
            <Button variant="outline" size="lg">
              Become a Sponsor
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
}
