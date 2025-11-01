"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

export default function VerifyPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const shortLink = params.shortLink as string;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already verified via cookie
    const checkVerification = async () => {
      try {
        const response = await axios.get(`/api/${shortLink}`);
        // If no error, redirect worked
        router.push(`/api/${shortLink}`);
      } catch (error) {
        // Link needs password, stay on page
      }
    };
    checkVerification();
  }, [shortLink, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!password) {
      setError("Please enter a password");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/verify-password", {
        shortLink,
        password,
      });

      if (response.data.verified) {
        toast.success("Password verified! Redirecting...");
        // Redirect to the short link (will check cookie now)
        setTimeout(() => {
          window.location.href = `/api/${shortLink}`;
        }, 500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Invalid password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-lg border-[1px] border-gray-300 p-8 space-y-6">
          {/* Lock Icon */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100">
              <Lock className="w-10 h-10 text-red-500" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Title & Description */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Password Protected
            </h1>
            <p className="text-gray-600 text-base">
              This link requires a password to access
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="pr-10 border-2 border-black rounded-lg"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full border-2 border-black bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Unlock Link
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

