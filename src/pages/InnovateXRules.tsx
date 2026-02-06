import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function InnovateXRules() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md">
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                InnovateX — Rules & Agreement
              </h1>

              <div className="mb-6 space-y-4 text-base text-foreground">
                <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                  <strong className="text-yellow-800">Important — Quiz conduct</strong>
                  <p className="text-sm text-yellow-700 mt-2">
                    Do NOT switch browser tabs or use <kbd>Alt</kbd>+<kbd>Tab</kbd> while taking the quiz. Switching tabs or losing focus may be recorded and can lead to disqualification.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold">Competition Rules</h2>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Teams must consist of up to 4 participants.</li>
                    <li>Projects must be built during the competition timeline.</li>
                    <li>All submissions must be original work.</li>
                    <li>Respect judges' decisions — they are final.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold">Agreement</h2>
                  <p className="text-muted-foreground mt-2">
                    By continuing you agree to the InnovateX rules and allow TURING to contact you regarding the competition. You also agree that your submitted project information may be shared with sponsors.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">I have read and agree to the InnovateX rules and agreement.</span>
              </label>

              <div className="flex items-center justify-between">
                <Button onClick={() => navigate(-1)} variant="ghost">
                  Back
                </Button>
                <Button disabled={!accepted} onClick={() => navigate("/innovatex/register")}>
                  Continue to Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </div>
  );
}
