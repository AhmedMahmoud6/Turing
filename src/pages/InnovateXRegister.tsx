import React from "react";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { saveCompetitionRegistration } from "@/lib/firebase";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  age: number;
  governorate: string;
};

export default function InnovateXRegister() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", age: 18, governorate: "" },
  });
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const onNext = async (data: FormValues) => {
    setIsSaving(true);
    const t = toast({ title: "Saving...", description: "Submitting registration" });

    try {
      const id = await saveCompetitionRegistration({
        name: data.name?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        age: Number(data.age),
        governorate: data.governorate?.trim(),
      });

      t.update({ id: t.id, title: "Saved", description: "Registration saved.", open: true });
      navigate("/innovatex/rules", { state: { regId: id } });
    } catch (e) {
      console.error("Failed to save InnovateX registration", e);
      t.update({ id: t.id, title: "Error", description: "Failed to save registration.", open: true });
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
            InnovateX — Stage 1 Registration
          </h1>
          <p className="mb-6 text-muted-foreground">Please provide your details to register for InnovateX Stage 1.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
              <FormField
                name="name"
                control={form.control}
                rules={{ required: "Name is required" }}
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
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="you@example.com" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                control={form.control}
                rules={{ required: "Phone is required" }}
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
                rules={{ required: "Age is required" }}
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
                rules={{ required: "Governorate is required" }}
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
                  {isSaving ? "Saving..." : "Next"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
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
