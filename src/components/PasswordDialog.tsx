"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPasswordSet: (password: string) => void;
  isPremium: boolean;
}

export function PasswordDialog({
  open,
  onOpenChange,
  onPasswordSet,
  isPremium,
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    setIsSubmitting(true);
    onPasswordSet(password);
    setPassword("");
    setIsSubmitting(false);
    onOpenChange(false);
    toast.success("Password added successfully");
  };

  const handleCancel = () => {
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Link Password
          </DialogTitle>
          <DialogDescription>
            {isPremium ? (
              "Add a password to protect your short link"
            ) : (
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  PRO
                </span>
                Password protection is a premium feature
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (min 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="pr-10 border-2 border-black rounded-lg"
                disabled={!isPremium}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={!isPremium}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-2 border-black bg-white text-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isPremium || isSubmitting}
              className="border-2 border-black bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              {isSubmitting ? "Adding..." : "Add Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

