import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import {
  fetchPayments,
  updatePayment,
} from "@/lib/firebase";
import { deletePayment } from "@/lib/firebase";
import { serverTimestamp } from "firebase/firestore";

type PaymentDoc = {
  id: string;
  photoUrl?: string | null;
  email?: string | null;
  name?: string | null;
  packageId?: string | null;
  originalTotal?: number | null;
  discountAmount?: number | null;
  total?: number | null;
  ticketSent?: boolean;
  dismissed?: boolean;
  ticketUrl?: string | null;
};

const PaymentReview = () => {
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (viewerImage) {
      setZoom(1);
      // reset scroll position when opening
      setTimeout(() => {
        try {
          if (imgWrapperRef.current) {
            imgWrapperRef.current.scrollLeft = 0;
            imgWrapperRef.current.scrollTop = 0;
          }
        } catch (e) {
          console.warn(e);
        }
      }, 0);
    }
  }, [viewerImage]);

  const load = async () => {
    try {
      const docs = await fetchPayments();
      setPayments(docs as PaymentDoc[]);
    } catch (err) {
      console.error(err);
      toast({ title: "Load failed", description: "Could not load payments" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setBusy = (id: string, v: boolean) =>
    setLoadingIds((s) => ({ ...s, [id]: v }));

  const handleSend = async (p: PaymentDoc) => {
    if (!p || !p.id) return;
    const id = p.id;
    if (p.ticketSent || p.dismissed) return;
    try {
      setBusy(id, true);
      const ticketUrl = `${window.location.origin}/ticket/${id}`;

      // First: notify backend to actually send the email (if configured).
      let backendNotified = false;
      let backendResponseText: string | null = null;
      try {
        const rawApiBase = import.meta.env.VITE_API_BASE_URL || "";
        const apiBase = rawApiBase ? (rawApiBase.startsWith("http") ? rawApiBase : `https://${rawApiBase}`) : "";
        if (apiBase) {
          try {
            const resp = await fetch(`${apiBase}/api/ticket/send`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: id, email: p.email, ticketUrl }),
            });
            const txt = await resp.text();
            backendResponseText = txt;
            backendNotified = resp.ok;
            console.log("/api/ticket/send response (admin call)", { status: resp.status, ok: resp.ok, body: txt });
          } catch (e) {
            console.warn("notify backend failed (fetch error)", e);
          }
        } else {
          // no backend configured — treat as local-only flow and mark as sent
          console.warn("VITE_API_BASE_URL not configured, skipping backend notify and marking sent locally");
          backendNotified = true;
        }
      } catch (e) {
        console.warn("notify backend failed", e);
      }

      // If backend reported success (or there is no backend configured), mark the payment as sent.
      if (backendNotified) {
        try {
          await updatePayment(id, {
            ticketSent: true,
            ticketSentAt: serverTimestamp(),
            ticketUrl,
            ...(backendResponseText ? { ticketResponse: backendResponseText } : {}),
          });
          toast({ title: "Ticket sent", description: `Ticket marked sent for ${p.email}` });
        } catch (uErr) {
          console.error("Failed to update payment after backend notify", uErr);
          toast({ title: "Partial success", description: "Backend notified but failed to mark Firestore" });
        }
      } else {
        toast({ title: "Send failed", description: "Could not notify backend to send ticket" });
      }

      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "Send failed", description: "Could not mark ticket as sent" });
    } finally {
      setBusy(id, false);
    }
  };

  const handleDismiss = async (p: PaymentDoc) => {
    if (!p || !p.id) return;
    const id = p.id;
    try {
      setBusy(id, true);
      await updatePayment(id, {
        dismissed: true,
        dismissedAt: serverTimestamp(),
      });
      toast({ title: "Dismissed", description: `Payment ${id} dismissed` });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "Dismiss failed", description: "Could not dismiss payment" });
    } finally {
      setBusy(id, false);
    }
  };

  const handleDelete = async (p: PaymentDoc) => {
    if (!p || !p.id) return;
    const ok = window.confirm(`Delete payment ${p.name}? This cannot be undone.`);
    if (!ok) return;
    try {
      setBusy(p.id, true);
      await deletePayment(p.id);
      toast({ title: "Deleted", description: `Payment ${p.id} removed` });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "Delete failed", description: "Could not delete payment" });
    } finally {
      setBusy(p.id, false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-heading text-2xl font-bold mb-6">Payment Review</h1>
            <p className="text-muted-foreground mb-6">
              Review uploaded payment proofs and send tickets or dismiss as needed.
            </p>

            <div className="space-y-6">
              {payments.length === 0 && (
                <div className="bg-card p-6 rounded-xl border border-border">
                  No payments found.
                </div>
              )}

              {payments.map((p) => (
                <div key={p.id} className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex gap-6 flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3">
                      {p.photoUrl ? (
                        <button
                          type="button"
                          onClick={() => {
                            setZoom(1);
                            setViewerImage(p.photoUrl);
                          }}
                          className="w-full"
                        >
                          <img src={p.photoUrl} alt={`payment-${p.id}`} className="w-full max-h-60 object-contain rounded-md" />
                        </button>
                      ) : (
                        <div className="w-full h-48 bg-background/10 flex items-center justify-center rounded-md">No photo</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <strong>{p.name || "Unnamed"}</strong>
                        <div className="text-sm text-muted-foreground">{p.email || "No email"}</div>
                        <div className="text-sm text-muted-foreground">Package: {p.packageId ?? "-"}</div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm">Original: {p.originalTotal ?? "-"} EGP</div>
                        <div className="text-sm">Discount: {p.discountAmount ?? 0} EGP</div>
                        <div className="text-sm">Total: {p.total ?? "-"} EGP</div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Button
                          disabled={!!p.ticketSent || !!p.dismissed || !!loadingIds[p.id]}
                          onClick={() => handleSend(p)}
                        >
                          {p.ticketSent ? "Already sent" : loadingIds[p.id] ? "Sending..." : "Send Ticket"}
                        </Button>

                        <Button
                          variant="destructive"
                          disabled={!!p.dismissed || !!loadingIds[p.id]}
                          onClick={() => handleDismiss(p)}
                        >
                          {p.dismissed ? "Dismissed" : "Dismiss"}
                        </Button>

                        <Button
                          variant="destructive"
                          disabled={!!loadingIds[p.id]}
                          onClick={() => handleDelete(p)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Dialog open={!!viewerImage} onOpenChange={(open) => { if (!open) setViewerImage(null); }}>
                <DialogOverlay />
                <DialogContent hideClose className="max-w-4xl w-full">
                  <div className="flex flex-col">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <Button onClick={() => {
                          const newZ = Math.min(4, +(zoom + 0.25).toFixed(2));
                          const wrapper = imgWrapperRef.current;
                          const imgEl = imgRef.current;
                          setZoom(newZ);
                          requestAnimationFrame(() => {
                            try {
                              if (!wrapper || !imgEl) return;
                              // center on image middle
                              const newWidth = imgEl.clientWidth;
                              const newHeight = imgEl.clientHeight;
                              const desiredScrollLeft = Math.max(0, (newWidth - wrapper.clientWidth) / 2);
                              const desiredScrollTop = Math.max(0, (newHeight - wrapper.clientHeight) / 2);
                              wrapper.scrollLeft = desiredScrollLeft;
                              wrapper.scrollTop = desiredScrollTop;
                            } catch (e) {
                              console.warn(e);
                            }
                          });
                        }}>+</Button>
                        <Button onClick={() => {
                          const newZ = Math.max(1, +(zoom - 0.25).toFixed(2));
                          const wrapper = imgWrapperRef.current;
                          const imgEl = imgRef.current;
                          setZoom(newZ);
                          requestAnimationFrame(() => {
                            try {
                              if (!wrapper || !imgEl) return;
                              // center on image middle
                              const newWidth = imgEl.clientWidth;
                              const newHeight = imgEl.clientHeight;
                              const desiredScrollLeft = Math.max(0, (newWidth - wrapper.clientWidth) / 2);
                              const desiredScrollTop = Math.max(0, (newHeight - wrapper.clientHeight) / 2);
                              wrapper.scrollLeft = desiredScrollLeft;
                              wrapper.scrollTop = desiredScrollTop;
                            } catch (e) {
                              console.warn(e);
                            }
                          });
                        }}>-</Button>
                        <Button onClick={() => {
                          setZoom(1);
                          requestAnimationFrame(() => {
                            try {
                              const wrapper = imgWrapperRef.current;
                              if (!wrapper) return;
                              wrapper.scrollLeft = 0;
                              wrapper.scrollTop = 0;
                            } catch (e) {
                              console.warn(e);
                            }
                          });
                        }}>Reset</Button>
                      </div>
                      <DialogClose>
                        <Button>Close</Button>
                      </DialogClose>
                    </div>

                    <div className="flex-1 overflow-auto">
                      {viewerImage && (
                        <div className="w-full flex items-center justify-center">
                          <div
                            ref={imgWrapperRef}
                            className="w-full"
                            style={{ maxHeight: "70vh", height: "70vh", overflow: "auto" }}
                          >
                            <img
                              ref={imgRef}
                              src={viewerImage}
                              alt="preview"
                              // zoom controlled by buttons
                              style={{
                                width: zoom === 1 ? "auto" : `${zoom * 100}%`,
                                maxWidth: zoom === 1 ? "80%" : "none",
                                height: "auto",
                                transition: "width 120ms, transform 120ms",
                                cursor: zoom > 1 ? "grab" : "default",
                                display: "block",
                                margin: "0 auto",
                              }}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentReview;
