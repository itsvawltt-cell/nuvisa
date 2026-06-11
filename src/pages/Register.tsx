import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plane } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    setError(null);
    setEmailError(false);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (signUpError) {
      // If the error is about sending confirmation email, the user was still
      // created in auth — show a helpful message instead of a raw error
      if (
        signUpError.message.toLowerCase().includes("email") ||
        signUpError.message.toLowerCase().includes("confirmation")
      ) {
        setEmailError(true);
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // If user exists but no session, email confirmation is required
    if (data.user && !data.session) {
      setSuccess(true);
    } else if (data.session) {
      // Auto-confirmed — redirect to home
      window.location.href = "/";
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col min-h-screen pt-16 items-center justify-center bg-muted/20">
        <div className="w-full max-w-md p-4">
          <div className="bg-card p-8 md:p-10 rounded-3xl shadow-lg border border-border">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
                <Plane className="h-8 w-8 text-accent" />
              </Link>
              <h1 className="font-heading text-2xl font-bold text-primary mb-2">
                Registration Successful!
              </h1>
              <p className="text-muted-foreground text-sm">
                Your account has been created. You can now sign in.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 items-center justify-center bg-muted/20">
      <div className="w-full max-w-md p-4">
        <div className="bg-card p-8 md:p-10 rounded-3xl shadow-lg border border-border">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
              <Plane className="h-8 w-8 text-accent" />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-primary mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Register to start your visa application journey.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {emailError && (
            <div className="mb-4 p-3 rounded-lg bg-accent/10 text-accent text-sm">
              Your account was created, but we couldn't send a confirmation email right now.
              You can still try to sign in — if email confirmation is disabled on the server, you'll be able to log in immediately.
              Otherwise, please check your email later for the confirmation link.
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}