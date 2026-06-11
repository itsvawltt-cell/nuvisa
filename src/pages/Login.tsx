import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import nuvisaLogo from "@/assets/images/nuvisa-logo.png";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

export default function Login() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-zinc-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <img src={nuvisaLogo} alt="NuVisa" className="h-8 w-auto" />
            </Link>
            <h1 className="text-lg font-semibold text-zinc-100 mb-1">Welcome back</h1>
            <p className="text-zinc-500 text-sm">Sign in to track your visa application.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-800/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="text-zinc-500 text-xs block mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
                className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-500 text-xs">Password</label>
                <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                className="w-full bg-transparent border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {form.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2.5 rounded-md text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-1"
              data-testid="btn-login-submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Don't have an application?{" "}
            <Link href="/apply" className="text-zinc-400 hover:text-zinc-200 transition-colors font-medium">Start here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
