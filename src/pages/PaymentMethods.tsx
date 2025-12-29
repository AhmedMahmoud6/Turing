import { useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { savePaymentRecord } from "@/lib/firebase";

const PaymentMethods = () => {
  type PaymentState = {
    selectedTicket?: string;
    quantity?: number;
    total?: number;
    appliedPromo?: string | null;
    discountAmount?: number;
    originalTotal?: number;
  };

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const state = (location.state ?? {}) as PaymentState;
  const {
    selectedTicket,
    quantity,
    total,
    appliedPromo,
    discountAmount,
    originalTotal,
  } = state;
  const packageId = params.packageId ?? selectedTicket ?? "standard";

  // Compute safe defaults when the page is opened directly (no navigation state)
  const computedTicket = selectedTicket ?? packageId ?? "standard";
  const computedOriginalTotal =
    originalTotal ?? (packageId === "friends" ? 1000 : 250);
  const computedDiscountAmount = typeof discountAmount === "number" ? discountAmount : 0;
  const computedTotal =
    total ?? Math.max(0, Math.round((computedOriginalTotal - computedDiscountAmount) * 100) / 100);

  const paymentOptions: Record<
    string,
    {
      vodafone: { qr: string; link: string; number: string };
      instapay: { qr: string; link: string; ipa: string };
    }
  > = {
    standard: {
      vodafone: {
        qr: "/payment-qr/vf-standard.jpeg",
        link: "http://vf.eg/vfcash?id=mt&qrId=jZiVct",
        number: "01003137654",
      },
      instapay: {
        qr: "/payment-qr/instapay.jpeg",
        link: "https://ipn.eg/S/gara.xq/instapay/1PzSU0",
        ipa: "gara.xq@instapay",
      },
    },
    friends: {
      vodafone: {
        qr: "/payment-qr/vf-friends.jpeg",
        link: "http://vf.eg/vfcash?id=mt&qrId=jZiVct&qrString=20d2ac67ce3eddad6ba04000aadc4c500ad161e3a7463421b3bba3ba38c213fd&parameters=vRUevHkvQsRAFRfddP0BMMlNbERgofFHEex2dlOwmPnUwY0p/CzG+Nr2Y/l32M2V",
        number: "01003137654",
      },
      instapay: {
        qr: "/payment-qr/instapay.jpeg",
        link: "https://ipn.eg/S/gara.xq/instapay/1PzSU0",
        ipa: "gara.xq@instapay",
      },
    },
  };

  const pkg = paymentOptions[packageId] ?? paymentOptions.standard;
  const displayQuantity = packageId === "friends" ? 5 : quantity ?? 1;

  const [method, setMethod] = useState<string>("vodafone");
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<{
    name: string;
    email: string;
    phone: string;
    age: number;
    transportation: boolean;
  }>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: 18,
      transportation: false,
    },
  });

  const handleFile = (file?: File) => {
    if (!file) return;

    // validate MIME type
    if (!file.type || !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
      return;
    }

    // optional: limit size to 5MB
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      toast({
        title: "File too large",
        description: "Image must be under 5 MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      setFileDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const lastCopiedRef = useRef("");
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // force a short cooldown so repeated clicks reliably show feedback
      lastCopiedRef.current = text;
      toast({ title: "Copied", description: "Value copied to clipboard." });
      setTimeout(() => {
        if (lastCopiedRef.current === text) lastCopiedRef.current = "";
      }, 700);
    } catch (e) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
      });
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!fileDataUrl) {
      toast({
        title: "Upload required",
        description: "Please upload a photo of the transaction.",
      });
      return;
    }

    setLoading(true);
    try {
      type PaymentPayload = {
        ticket: string | null;
        quantity: number;
        originalTotal: number | null;
        discountAmount: number;
        promoCode: string | null;
        hasPromo: boolean;
        total: number | null;
        packageId: string;
        method: string;
        photoUrl: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        age: number | null;
        needTransportation: boolean;
      };

      const payload: PaymentPayload = {
        ticket: computedTicket ?? null,
        quantity: displayQuantity,
        originalTotal: computedOriginalTotal,
        discountAmount: computedDiscountAmount,
        promoCode: appliedPromo ?? null,
        hasPromo: !!appliedPromo,
        total: computedTotal,
        packageId: packageId ?? "",
        method,
        photoUrl: fileDataUrl as string,
        name: values.name?.trim() ?? null,
        email: values.email?.trim() ?? null,
        phone: values.phone?.trim() ?? null,
        age: Number(values.age) || null,
        needTransportation: !!values.transportation,
      };

      await savePaymentRecord(payload);

      setLoading(false);
      toast({
        title: "Payment submitted",
        description:
          "Your payment proof was uploaded. We'll validate it shortly.",
      });
      navigate("/tickets", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast({
        title: "Save failed",
        description: "Failed to save payment. Try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border overflow-x-hidden">
            <h1 className="font-heading text-2xl font-bold mb-4">
              Payment Methods
            </h1>
            <p className="text-muted-foreground mb-6">
              Choose a method (Vodafone Cash or InstaPay), make the transfer,
              then upload a photo of the transaction to validate your payment.
            </p>

            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      checked={method === "vodafone"}
                      onChange={() => setMethod("vodafone")}
                    />
                    <span>Vodafone Cash</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      checked={method === "instapay"}
                      onChange={() => setMethod("instapay")}
                    />
                    <span>InstaPay</span>
                  </label>
                </div>

                <FormField
                  name="name"
                  control={form.control}
                  rules={{
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z\u0600-\u06FF\s'-]+$/,
                      message:
                        "Name must contain only letters, spaces, hyphens or apostrophes",
                    },
                    validate: (v: string) =>
                      v?.trim().length >= 2 ||
                      "Name must be at least 2 characters",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="you@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phone"
                  control={form.control}
                  rules={{
                    required: "Phone is required",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "Phone must contain exactly 11 digits",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="010xxxxxxxx" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="age"
                  control={form.control}
                  rules={{
                    required: "Age is required",
                    min: { value: 1, message: "Invalid age" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="transportation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(
                              v: boolean | "indeterminate" | undefined
                            ) => field.onChange(Boolean(v))}
                          />
                        </FormControl>
                        <span className="select-none">
                          Need Transportation?
                        </span>
                      </label>
                    </FormItem>
                  )}
                />

                {method === "vodafone" ? (
                  <div className="p-6 rounded-xl bg-card border w-full sm:w-3/6">
                    <h4 className="font-heading font-bold mb-2">
                      Vodafone Cash
                    </h4>
                    <img
                      src={pkg.vodafone.qr}
                      alt="Vodafone QR"
                      className="w-full h-auto mb-2"
                    />
                    <p className="text-sm">Number: {pkg.vodafone.number}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={pkg.vodafone.link}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open Vodafone
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pkg.vodafone.number)}
                        className="text-sm underline"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Quantity: {displayQuantity}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-card border w-full sm:w-3/6">
                    <h4 className="font-heading font-bold mb-2">InstaPay</h4>
                    <img
                      src={pkg.instapay.qr}
                      alt="InstaPay QR"
                      className="w-full h-auto mb-2"
                    />
                    <p className="text-sm">IPA: {pkg.instapay.ipa}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={pkg.instapay.link}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open InstaPay
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pkg.instapay.ipa)}
                        className="text-sm underline"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                      Quantity: {displayQuantity}
                    </p>
                  </div>
                )}

                <div className="p-6 rounded-xl bg-background/5 border border-background/10">
                  <label className="block mb-2 font-medium">
                    Upload transaction photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  {fileDataUrl && (
                    <img
                      src={fileDataUrl}
                      alt="preview"
                      className="mt-4 max-h-60 object-contain"
                    />
                  )}
                </div>

                <div className="flex gap-4 max-sm:text-xs">
                  <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    variant="ghost"
                  >
                    Back
                  </Button>
                  <Button
                    className="max-sm:text-xs"
                    type="submit"
                    disabled={loading}
                    variant="hero"
                  >
                    {loading ? "Saving..." : "Upload & Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentMethods;
