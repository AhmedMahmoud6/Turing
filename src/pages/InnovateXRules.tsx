import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function InnovateXRules() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            InnovateX — Rules & Agreement
          </h1>

          <div className="prose mb-6">
            <h2>Competition Rules</h2>
            <ul>
              <li>Teams must consist of up to 4 participants.</li>
              <li>Projects must be built during the competition timeline.</li>
              <li>All submissions must be original work.</li>
              <li>Respect judges' decisions — they are final.</li>
            </ul>

            <h2>Agreement</h2>
            <p>
              By continuing you agree to the InnovateX rules and allow TURING to
              contact you regarding the competition. You also agree that your
              submitted project information may be shared with sponsors.
            </p>
          </div>

          <label className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              I have read and agree to the InnovateX rules and agreement.
            </span>
          </label>

          <div className="flex gap-3">
            <Button onClick={() => navigate(-1)} variant="ghost">
              Back
            </Button>
            <Button
              disabled={!accepted}
              onClick={() => navigate("/", { replace: true })}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
