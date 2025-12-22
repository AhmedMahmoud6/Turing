import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { saveRegistration } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { DocumentData } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { workshops } from "@/components/landing/ProgramsSection";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  age: number;
  governorate: string;
};

export default function WorkshopRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", age: 18, governorate: "" },
  });
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const lastToastRef = React.useRef<ReturnType<typeof toast> | null>(null);

  const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE = workshops.find(
    (workId) => workId.id === id
  ).templateId;
  const EMAILJS_PUBLIC_KEY =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
    import.meta.env.VITE_EMAILJS_USER_ID;

  // Initialize EmailJS if public key is available
  React.useEffect(() => {
    if (EMAILJS_PUBLIC_KEY && typeof emailjs.init === "function") {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (err) {
        console.warn("EmailJS init failed", err);
      }
    }
  }, [EMAILJS_PUBLIC_KEY]);

  const onSubmit = (data: FormValues) => {
    (async () => {
      // debug log
      setIsSaving(true);
      const t = toast({
        title: "Saving...",
        description: "Submitting your registration",
      });
      lastToastRef.current = t;
      try {
        // Trim string fields to prevent submissions that are only whitespace
        const payload = {
          ...data,
          age: Number(data.age),
          name: data.name?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim(),
          governorate: data.governorate?.trim(),
        };

        await saveRegistration(id as string, payload as DocumentData);

        // Try to send confirmation email (if EmailJS is configured)
        let emailSent = false;
        if (EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_PUBLIC_KEY) {
          try {
            await emailjs.send(
              EMAILJS_SERVICE,
              EMAILJS_TEMPLATE,
              {
                // include several common variable names so templates with different variable names succeed
                to_email: payload.email,
                to_name: payload.name,
                from_name: payload.name,
                reply_to: payload.email,
                email: payload.email,
                name: payload.name,
                phone: payload.phone,
                workshop:
                  workshops.find((workId) => workId.id === id).title ?? id,
                governorate: payload.governorate,
                age: payload.age,
                message: `Registration for ${
                  workshops.find((workId) => workId.id === id).title ?? id
                } by ${payload.name}`,
              },
              EMAILJS_PUBLIC_KEY
            );
            emailSent = true;
          } catch (err) {
            // better error info for 4xx/5xx responses
            console.error("EmailJS send failed", err);
            try {
              // some errors include a `text` or `status` property
              const details = err?.text || err?.status || JSON.stringify(err);
              console.error("EmailJS error details:", details);
              if (t)
                t.update({
                  id: t.id,
                  title: "Saved (email failed)",
                  description: `Registration saved but confirmation email failed to send: ${details}`,
                  open: true,
                });
            } catch (e) {
              if (t)
                t.update({
                  id: t.id,
                  title: "Saved (email failed)",
                  description:
                    "Registration saved but confirmation email failed to send.",
                  open: true,
                });
            }
          }
        }

        t.update({
          id: t.id,
          title: "Success",
          description: emailSent
            ? "Registration saved and confirmation email sent."
            : EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_PUBLIC_KEY
            ? "Registration saved. Confirmation email failed to send."
            : "Registration saved. Confirmation email not configured.",
          open: true,
        });

        navigate("/");
      } catch (e) {
        console.error("Failed to save registration", e);
        if (t)
          t.update({
            id: t.id,
            title: "Error",
            description: "Failed to save registration.",
            open: true,
          });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Register for
          </h1>
          <p className="mb-6 text-muted-foreground">
            {workshops.find((workId) => workId.id === id).title ?? id}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="governorate"
                control={form.control}
                rules={{
                  required: "Governorate is required",
                  pattern: {
                    value: /^[A-Za-z\u0600-\u06FF\s'-]+$/,
                    message: "Governorate must contain only letters and spaces",
                  },
                  validate: (v: string) =>
                    v?.trim().length >= 2 || "Governorate must contain letters",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governorate</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Cairo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    // dismiss any active toast
                    if (lastToastRef.current) lastToastRef.current.dismiss();
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
