import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Mic,
  Music,
  Users,
  Award,
  Coffee,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ticketTypes = [
  {
    id: "standard",
    name: "Standard Ticket",
    price: 250,
    currency: "EGP",
    badge: "1 ticket",
    description: "Full event access for one attendee",
    features: [],
    popular: false,
  },
  {
    id: "friends",
    name: "Friends Package",
    price: 1000,
    originalPrice: 1250,
    currency: "EGP",
    badge: "4 + 1 FREE",
    description: "Perfect for groups of 5 friends",
    features: [
      "5 tickets (pay for 4, get 1 free)",
      "Group seating together",
      "All standard ticket benefits",
      "Priority networking access",
      "Exclusive group photo opportunity",
      "20% savings vs individual tickets",
    ],
    popular: true,
  },
];

const includedItems = [
  { icon: Mic, label: "Inspiring Talks", description: "12+ speaker sessions" },
  { icon: Music, label: "Performances", description: "Live entertainment" },
  { icon: Users, label: "Networking", description: "Meet innovators" },
  { icon: Award, label: "Certificate", description: "Digital attendance cert" },
  {
    icon: Coffee,
    label: "Refreshments",
    description: "Coffee breaks included",
  },
];

const faqs = [
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Tickets are non-refundable but can be transferred to another person up to 48 hours before the event. Contact us at tedxitech@gmail.com for assistance.",
  },
  {
    question: "How do I transfer my ticket?",
    answer:
      "Email us at tedxitech@gmail.com with your ticket details and the new attendee's information. Transfers must be completed at least 48 hours before the event.",
  },
  {
    question: "What's the seating arrangement?",
    answer:
      "Seating is assigned based on ticket type. Friends Package holders are guaranteed seats together. Standard ticket holders receive premium seating on a first-come basis.",
  },
  {
    question: "Will there be parking available?",
    answer:
      "Yes, Mall of Arabia offers ample parking facilities. The GrEEK Campus is easily accessible from multiple mall entrances.",
  },
  {
    question: "Is the venue accessible?",
    answer:
      "Yes, The GrEEK Campus is fully accessible with wheelchair ramps, elevators, and accessible restrooms.",
  },
];

const Tickets = () => {
  const [selectedTicket, setSelectedTicket] = useState("standard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const selectedTicketData = ticketTypes.find((t) => t.id === selectedTicket);
  // Use package price directly; standard = 1 ticket price, friends = package price
  const originalTotal = selectedTicketData ? selectedTicketData.price : 0;

  // Promo codes mapping: code -> package-specific discounts
  // Add new promo codes here and set values per package
  const promoCodes: Record<string, { standard: number; friends: number }> = {
    F2A: { standard: 50, friends: 150 },
    SBS: { standard: 50, friends: 150 },
    ITCH: { standard: 50, friends: 150 },
  };

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const discountedTotal = Math.max(
    0,
    Math.round((originalTotal - discountAmount) * 100) / 100
  );

  // promo is applied live in the input onChange; no separate apply button needed

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 circuit-bg opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-heading text-sm font-medium uppercase tracking-wider mb-6">
                Tickets
              </span>
              <h1 className="font-heading text-display-sm md:text-display-md font-bold mb-6">
                Book Your <span className="text-primary">Tickets</span>
              </h1>
              <p className="text-xl text-background/70 mb-8">
                Reserve your seat for TURING — TEDxITechSchoolYouth 2026
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-background/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-heading font-medium">6 Feb 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-heading font-medium">
                    9:00 AM – 8:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-heading font-medium">
                    GrEEK Campus MOA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket Selection */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
                Choose Your <span className="text-primary">Package</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket.id);
                      setPromoInput("");
                      setAppliedPromo(null);
                      setDiscountAmount(0);
                    }}
                    className={`relative cursor-pointer rounded-2xl p-8 transition-all duration-300 ${
                      selectedTicket === ticket.id
                        ? "bg-card border-2 border-primary shadow-glow"
                        : "bg-card border-2 border-border hover:border-primary/50"
                    }`}
                  >
                    {ticket.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground font-heading text-xs font-bold uppercase tracking-wider">
                          Best Value
                        </span>
                      </div>
                    )}

                    {ticket.badge && (
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-xs font-bold uppercase tracking-wider mb-4">
                        {ticket.badge}
                      </span>
                    )}

                    <h3 className="font-heading text-2xl font-bold mb-2">
                      {ticket.name}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {ticket.description}
                    </p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="font-heading text-4xl font-bold">
                        {ticket.price}
                      </span>
                      <span className="text-muted-foreground">
                        {ticket.currency}
                      </span>
                      {ticket.originalPrice && (
                        <span className="text-muted-foreground line-through ml-2">
                          {ticket.originalPrice} {ticket.currency}
                        </span>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    <div
                      className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTicket === ticket.id
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedTicket === ticket.id && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="bg-card rounded-2xl p-8 border border-border mb-16">
                <h3 className="font-heading text-xl font-bold mb-8 text-center">
                  What's <span className="text-primary">Included</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {includedItems.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <p className="font-heading font-medium text-sm mb-1">
                        {item.label}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Section */}
              <div className="bg-foreground text-background rounded-2xl p-8 mb-16">
                <h3 className="font-heading text-xl font-bold mb-8">
                  Complete Your Order
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Ticket Type */}
                    <div>
                      <label className="block text-sm font-heading font-medium mb-2 text-background/70">
                        Selected Ticket
                      </label>
                      <div className="p-4 rounded-xl bg-background/10 border border-background/20">
                        <p className="font-heading font-bold">
                          {selectedTicketData?.name}
                        </p>
                        <p className="text-sm text-background/60">
                          {selectedTicketData?.price}{" "}
                          {selectedTicketData?.currency}
                          {selectedTicket === "friends"
                            ? " (5 tickets)"
                            : " (1 ticket)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    {/* Total */}
                    <div className="p-6 rounded-xl bg-background/10 border border-background/20 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-background/70">Subtotal</span>
                        <span>{originalTotal} EGP</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-lg">
                          Total
                        </span>
                        <span className="font-heading font-bold text-2xl text-primary">
                          {discountedTotal} EGP
                        </span>
                      </div>
                    </div>

                    <div className="bg-background/10 rounded-2xl p-4 border border-background/20 mb-6">
                      <label className="block text-sm font-heading font-medium mb-2">
                        Promo code
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="text-foreground flex-1 rounded-md border px-3 py-2 w-full"
                          placeholder="Enter promo code"
                          value={promoInput}
                          onChange={(e) => {
                            const v = e.target.value;
                            setPromoInput(v);
                            const code = (v || "").trim().toUpperCase();
                            if (!code) {
                              setAppliedPromo(null);
                              setDiscountAmount(0);
                              return;
                            }
                            const promo = promoCodes[code];
                            if (!promo) {
                              setAppliedPromo(null);
                              setDiscountAmount(0);
                              return;
                            }
                            const pkgKey = selectedTicket ?? "standard";
                            const discountForPackage =
                              promo[pkgKey as "standard" | "friends"] ?? 0;
                            setAppliedPromo(code);
                            setDiscountAmount(discountForPackage);
                          }}
                        />
                      </div>
                      {appliedPromo && (
                        <p className="mt-2 text-sm text-muted-background">
                          Applied {appliedPromo}: -{discountAmount} EGP
                        </p>
                      )}
                    </div>

                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full"
                      onClick={() =>
                        navigate(`/payment/${selectedTicketData?.id}`, {
                          state: {
                            selectedTicket: selectedTicketData?.id,
                            originalTotal,
                            discountAmount,
                            appliedPromo,
                            total: discountedTotal,
                          },
                        })
                      }
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-center mb-8">
                  Frequently Asked{" "}
                  <span className="text-primary">Questions</span>
                </h3>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFaq(openFaq === index ? null : index)
                        }
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-heading font-medium">
                          {faq.question}
                        </span>
                        {openFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-6">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;
