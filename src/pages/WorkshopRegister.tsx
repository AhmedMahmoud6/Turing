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
// backend will receive registrations; do not save from client
// import { saveRegistration } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { DocumentData } from "firebase/firestore";
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

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    const t = toast({
      title: "Saving...",
      description: "Submitting your registration",
    });
    lastToastRef.current = t;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      // determine program metadata from `workshops`
      const program = workshops.find((w) => w.id === id) || null;
      const resp = await fetch(`${apiBase}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: id,
          name: data.name?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim(),
          age: Number(data.age),
          governorate: data.governorate?.trim(),
          // include program title/name and whatsapp group link for the email template
          program_title: program ? program.title : "",
          program_name: program ? program.title : "",
          group_link: program && program.whatsapp_group ? program.whatsapp_group : "",
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Backend register failed", resp.status, text);
        t.update({ id: t.id, title: "Error", description: "Failed to save registration.", open: true });
      } else {
        t.update({ id: t.id, title: "Success", description: "Registration sent — confirmation will follow.", open: true });
        navigate("/");
      }
    } catch (e) {
      console.error("Failed to call backend", e);
      if (t) t.update({ id: t.id, title: "Error", description: "Failed to save registration.", open: true });
    } finally {
      setIsSaving(false);
    }
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
