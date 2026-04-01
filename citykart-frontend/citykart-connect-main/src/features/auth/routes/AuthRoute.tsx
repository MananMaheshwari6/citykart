import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthRoute() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"buyer" | "vendor">("buyer");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(regName, regEmail, regPassword, regRole);
      toast.success("Account created!");
      navigate(regRole === "vendor" ? "/vendor" : "/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold font-display text-center text-card-foreground mb-6">Welcome to CityKart</h1>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" required disabled={submitting} />
              </div>
              <div>
                <Label htmlFor="login-pass">Password</Label>
                <Input id="login-pass" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required disabled={submitting} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="reg-name">Full Name</Label>
                <Input id="reg-name" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="John Doe" required disabled={submitting} />
              </div>
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com" required disabled={submitting} />
              </div>
              <div>
                <Label htmlFor="reg-pass">Password</Label>
                <Input id="reg-pass" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" required disabled={submitting} />
              </div>
              <div>
                <Label>Account Type</Label>
                <div className="flex gap-2 mt-1">
                  <Button type="button" variant={regRole === "buyer" ? "default" : "outline"} size="sm" onClick={() => setRegRole("buyer")} disabled={submitting}>
                    Buyer
                  </Button>
                  <Button type="button" variant={regRole === "vendor" ? "default" : "outline"} size="sm" onClick={() => setRegRole("vendor")} disabled={submitting}>
                    Vendor
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating…" : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
