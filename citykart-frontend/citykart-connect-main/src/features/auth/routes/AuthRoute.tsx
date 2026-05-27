import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/features/auth/auth-context";
import type { City } from "@/features/marketplace/types";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required").max(100),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["buyer", "vendor"]),
    cityId: z.string().optional(),
  })
  .refine(
    (data) => data.role !== "vendor" || (data.cityId !== undefined && data.cityId.length > 0),
    { message: "Please select your city", path: ["cityId"] }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthRoute() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: citiesData } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await apiFetch("/cities");
      const data = (await res.json()) as { cities?: City[] };
      return data.cities ?? [];
    },
    staleTime: Infinity,
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "buyer", cityId: "" },
  });

  const watchedRole = form.watch("role");

  useEffect(() => {
    if (watchedRole === "buyer") {
      form.setValue("cityId", "");
      form.clearErrors("cityId");
    }
  }, [watchedRole, form]);

  const clearFormErrors = () => {
    setLoginError(null);
    setRegError(null);
    form.clearErrors();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onRegister = async (values: RegisterFormValues) => {
    setRegError(null);
    setSubmitting(true);
    try {
      await register(
        values.name,
        values.email,
        values.password,
        values.role,
        values.role === "vendor" ? values.cityId : undefined
      );
      toast.success("Account created!");
      navigate(values.role === "vendor" ? "/vendor" : "/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setRegError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold font-display text-center text-card-foreground mb-6">
          Welcome to CityKart
        </h1>

        <Tabs defaultValue="login" onValueChange={() => clearFormErrors()}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="login-pass">Password</Label>
                <Input
                  id="login-pass"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={submitting}
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive" role="alert">
                  {loginError}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onRegister)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" disabled={submitting} {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          disabled={submitting}
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <div className="flex gap-2 mt-1">
                        <Button
                          type="button"
                          variant={field.value === "buyer" ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange("buyer")}
                          disabled={submitting}
                        >
                          Buyer
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "vendor" ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange("vendor")}
                          disabled={submitting}
                        >
                          Vendor
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedRole === "vendor" && (
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your shop city</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          disabled={submitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the city where your shop is located" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(citiesData ?? []).map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name}, {city.state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {regError && (
                  <p className="text-sm text-destructive" role="alert">
                    {regError}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating…" : "Create Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
