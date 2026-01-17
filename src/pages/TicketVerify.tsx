import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const TicketVerify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  type UserInfo = {
    name?: string;
    email?: string;
    phone?: string;
    promoCode?: string | null;
    [key: string]: unknown;
  };

  type TicketInfo = {
    ticketCode?: string;
    scanned?: boolean;
    scannedAt?: string | null;
    user?: UserInfo | null;
    [key: string]: unknown;
  } | null;

  const [info, setInfo] = useState<TicketInfo>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [codeInput, setCodeInput] = useState<string>("");

  const fetchInfo = async (code: string) => {
    setError(null);
    setInfo(null);
    if (!code) return setError("Enter a ticket code");
    const apiBase = import.meta.env.VITE_API_BASE_URL || "";
    try {
      const res = await fetch(
        `${apiBase}/api/ticket/check?code=${encodeURIComponent(code)}`
      );
      const parsed = (await res.json()) as Record<string, unknown> | null;
      if (!res.ok) {
        const serverError = parsed && typeof parsed.error === "string" ? parsed.error : "Not found";
        setError(serverError);
        return;
      }
      // treat parsed as TicketInfo when successful
      setInfo((parsed as unknown) as TicketInfo);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  const handleConfirm = async () => {
    const code = codeInput?.trim();
    if (!code) return setError("Missing code");
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiBase}/api/ticket/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const parsed = (await res.json()) as Record<string, unknown> | null;
      setLoading(false);
      if (!res.ok) {
        const serverError = parsed && typeof parsed.error === "string" ? parsed.error : "Failed to check in";
        setError(serverError);
        return;
      }
      const ok = parsed && typeof parsed.ok === "boolean" ? parsed.ok : false;
      if (ok) {
        setCheckedIn(true);
        setInfo((prev) => ({
          ...((prev as TicketInfo) ?? {}),
          scanned: true,
          scannedAt: new Date().toISOString(),
          ticketCode: code,
        }));
      } else {
        const msg = parsed && typeof parsed.message === "string" ? parsed.message : "Failed to check in";
        setError(msg);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border overflow-x-hidden">
            <h1 className="font-heading text-2xl font-bold mb-4">
              Ticket Verify
            </h1>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Ticket code</label>
              <input
                className="w-full p-2 border rounded"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchInfo(codeInput.trim());
                }}
                onPaste={(e) => {
                  // Prevent default insertion to avoid duplicate text (browser inserts after paste event)
                  e.preventDefault();
                  const pasted = (e.clipboardData && e.clipboardData.getData("text")) || "";
                  const trimmed = pasted.trim();
                  if (trimmed) {
                    setCodeInput(trimmed);
                    fetchInfo(trimmed);
                  }
                }}
                placeholder="Paste ticket code here or scan QR"
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => fetchInfo(codeInput.trim())}>
                  Lookup
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCodeInput("");
                    setInfo(null);
                    setError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
            {error && <p className="text-destructive">{error}</p>}
            {info && (
              <div>
                <p>
                  <strong>Ticket:</strong> {info.ticketCode}
                </p>
                <p>
                  <strong>Scanned:</strong> {info.scanned ? "Yes" : "No"}
                </p>
                {info.user && (
                  <div className="mt-4">
                    <p>
                      <strong>Name:</strong> {info.user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {info.user.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {info.user.phone}
                    </p>
                    <p>
                      <strong>Promo:</strong> {info.user.promoCode ?? "—"}
                    </p>
                  </div>
                )}
                <div className="flex gap-4 mt-6">
                  <Button
                    disabled={loading || info.scanned}
                    variant="hero"
                    onClick={handleConfirm}
                  >
                    {loading
                      ? "Checking..."
                      : info.scanned
                      ? "Already scanned"
                      : "Confirm Check-in"}
                  </Button>
                </div>
                {checkedIn && (
                  <p className="mt-4 text-success">Checked in successfully.</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TicketVerify;
