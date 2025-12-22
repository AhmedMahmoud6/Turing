import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Users, Eye, Megaphone, Mail, ArrowRight } from "lucide-react";

const sponsorTiers = [
  {
    name: "Platinum",
    className: "tier-platinum",
    benefits: [
      "Premium logo placement on all materials",
      "Exclusive speaking opportunity (5 min)",
      "VIP seating for 10 guests",
      "Full brand integration across event",
      "Social media feature campaign",
      "Post-event video recognition",
    ],
  },
  {
    name: "Gold",
    className: "tier-gold",
    benefits: [
      "Prominent logo on event materials",
      "VIP seating for 6 guests",
      "Social media mentions",
      "Brand visibility at venue",
      "Newsletter feature",
    ],
  },
  {
    name: "Silver",
    className: "tier-silver",
    benefits: [
      "Logo on event materials",
      "Seating for 4 guests",
      "Social media mention",
      "Brand display at venue",
    ],
  },
  {
    name: "Collaborator",
    className: "tier-inkind",
    benefits: [
      "Logo on event materials",
      "Social media recognition",
      "Seating for 2 guests",
    ],
  },
];

const whySponsor = [
  {
    icon: Users,
    title: "Youth Reach",
    description:
      "Connect with 500+ young innovators, students, and future leaders actively shaping tomorrow's world.",
  },
  {
    icon: Megaphone,
    title: "Brand Engagement",
    description:
      "Position your brand at the forefront of innovation and technology in a meaningful, impactful way.",
  },
  {
    icon: Eye,
    title: "Visibility",
    description:
      "Gain exposure through our multi-channel marketing campaign reaching thousands across social media.",
  },
];

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 hexagon-pattern opacity-10" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-6">
                Partnership
              </span>
              <h1 className="font-heading text-display-sm md:text-display-md font-bold mb-6">
                Become a <span className="text-primary">Sponsor</span>
              </h1>
              <p className="text-xl text-background/70 mb-10">
                Support youth innovation at TURING and connect your brand with
                the next generation of leaders.
              </p>

              <a href="#contact">
                <Button variant="hero" size="xl">
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
                  Packages
                </span>
                <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
                  Sponsorship <span className="text-primary">Tiers</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Choose the partnership level that aligns with your goals and
                  budget.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sponsorTiers.map((tier, index) => (
                  <div
                    key={tier.name}
                    className={`rounded-2xl p-6 bg-card ${tier.className} transition-all duration-300 hover:shadow-elevated`}
                  >
                    <h3 className="font-heading text-xl font-bold mb-6 text-center uppercase tracking-wider">
                      {tier.name}
                    </h3>

                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Sponsor */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
                  Benefits
                </span>
                <h2 className="font-heading text-display-sm md:text-display-md font-bold mb-4">
                  Why <span className="text-primary">Sponsor?</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {whySponsor.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 glow-border"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Event Stats */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                    500+
                  </p>
                  <p className="text-background/60">Expected Attendees</p>
                </div>
                <div>
                  <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                    12+
                  </p>
                  <p className="text-background/60">Speakers</p>
                </div>
                <div>
                  <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                    50K+
                  </p>
                  <p className="text-background/60">Social Reach</p>
                </div>
                <div>
                  <p className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                    13
                  </p>
                  <p className="text-background/60">Hours of Content</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-4">
                Get in Touch
              </span>
              <h2 className="font-heading text-display-sm font-bold mb-6">
                Ready to <span className="text-primary">Partner?</span>
              </h2>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
                We'd love to discuss how we can create a meaningful partnership
                that aligns with your brand values.
              </p>

              <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Email us at</p>
                    <a
                      href="mailto:tedxitech@gmail.com"
                      className="font-heading font-bold text-lg hover:text-primary transition-colors"
                    >
                      tedxitech@gmail.com
                    </a>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  Or connect with us on social media for updates and
                  announcements.
                </p>

                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61578381831367"
                    target="_blank"
                    className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-heading text-sm font-medium"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/tedx.itech/"
                    target="_blank"
                    className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-heading text-sm font-medium"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/company/%E2%80%8Ftedxitech%E2%80%8F/"
                    target="_blank"
                    className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-heading text-sm font-medium"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              <Button variant="hero" size="xl">
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;
