import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentResult = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const order = query.get("order");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!order) {
      setMessage("Missing order id");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30; // ~30 * 2s = 60s

    const poll = async () => {
      if (cancelled) return;
      attempts += 1;
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(
          `${apiBase}/api/payment/status?merchantOrderId=${encodeURIComponent(
            order
          )}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus(data.status || null);
          if (data.verified) {
            setMessage("Payment verified — finalizing...");
            setLoading(true);
            // trigger fulfill to send email/receipt
            const f = await fetch(`${apiBase}/api/payment/fulfill`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ merchantOrderId: order }),
            });
            const fd = await f.json();
            setLoading(false);
            if (f.ok) {
              // backend may return { message: 'receipt already sent' } when idempotent
              if (fd.message && fd.message.toLowerCase().includes("receipt already sent")) {
                setMessage("Payment successful. Receipt already sent.");
              } else if (fd.receiptSent) {
                setMessage("Payment successful. Receipt sent to email.");
              } else {
                setMessage("Payment successful. No receipt was sent.");
              }
            } else {
              setMessage(
                `Payment verified but fulfill failed: ${fd.error || JSON.stringify(fd)}`
              );
            }
            return;
          }
          setMessage("Payment pending — checking again...");
        } else {
          setMessage(data.error || "status check failed");
        }
      } catch (err) {
        setMessage("Network error checking payment status");
        console.error(err);
      }

      if (attempts < maxAttempts && !cancelled) {
        setTimeout(poll, 2000);
      } else if (!cancelled) {
        setMessage(
          "Timed out waiting for payment. You can refresh to check again."
        );
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [order]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border overflow-x-hidden">
            <h1 className="font-heading text-2xl font-bold mb-4">
              Payment Result
            </h1>
            <p className="mb-4">Order: {order}</p>
            <p className="mb-4">Status: {status ?? "Unknown"}</p>
            <p className="mb-4">{message}</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/tickets")}>
                Go to tickets
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResult;
