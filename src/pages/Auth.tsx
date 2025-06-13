import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    signIn,
    signUp,
    signInWithGoogle,
    user,
    userRole,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  // Redirect automatico in base al ruolo
  useEffect(() => {
    if (!authLoading && user) {
      if (userRole === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [user, userRole, authLoading, navigate]);

  // Loader se user è pronto ma ruolo non ancora caricato
  if (user && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || "Login failed. Please try again.");
        } else {
          toast.success("Welcome back!");
        }
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("Database error saving new user")) {
            toast.error("Registration temporarily unavailable. Please try again later.");
          } else {
            toast.error(error.message || "Registration failed. Please try again.");
          }
        } else {
          toast.success("Registration successful! Check your email to verify.");
        }
      }
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[400px]">
        <Card className="shadow-xl border-0 px-6 py-8 rounded-2xl bg-white">
          <CardHeader className="text-center pb-4">
            <img
              src="https://cdn.prod.website-files.com/672c7e4b5413fe846587b57a/67c49c1494c4ed22fa5ef425_Favicon%2096.svg"
              alt="Welo logo"
              className="w-12 h-12 mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              {isLogin
                ? "Sign in to your Welo account"
                : "Join Welo and get your trust badge"}
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch (error) {
                  toast.error("Google login failed.");
                }
              }}
              className="w-full border-gray-300 mb-4"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </Button>

            <Separator className="my-4" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium ml-1 p-0 h-auto"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
