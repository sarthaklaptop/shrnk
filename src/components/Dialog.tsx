import { Link2, Lock, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import validUrl from "valid-url";
import axios from "axios";
import { userStorage } from "@/store/link";
import { PasswordDialog } from "./PasswordDialog";

interface DialogCloseButtonProps {
  label?: string;
  className?: string;
}

export function DialogCloseButton({ label = "Create", className = "" }: DialogCloseButtonProps) {
  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const user = userStorage.getState().user;
  const isPremium = user.userType === "PREMIUM";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);  
  };

  const handlePasswordSet = (pwd: string) => {
    setPassword(pwd);
  };

  const handleRemovePassword = () => {
    setPassword(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!urlInput) {
      toast("Please enter a URL", {
        description: "URL is required to shorten the URL",
      });
      return;
    }

    if (!validUrl.isUri(urlInput)) {
      toast("Please enter a valid URL");
      return;
    }

    try {
      const payload: { longLink: string; password?: string } = { longLink: urlInput };
      if (password) {
        payload.password = password;
      }

      const result = await axios.post("/api/link", payload);
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);
      const currentCredits = userStorage.getState().user.credits;
      if (currentCredits !== null) {
        userStorage.getState().updateCredits(currentCredits - 1);
      }
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
      setResponse(result.data.data.shortLink);
      setUrlInput("");
      setPassword(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unexpected error occurred.";
      toast.warning(errorMessage);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`modern-button-primary ${className}`}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-gray-200 dark:border-gray-700 shadow-large">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Link2 className="w-5 h-5" />
              Create New Link
            </DialogTitle>
            <DialogClose asChild>
              <button className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </div>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Enter the destination URL you want to shorten
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          {/* URL Input Section */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Destination URL
            </Label>
            <Input
              id="link"
              placeholder="https://example.com/very/long/url..."
              value={urlInput}
              onChange={handleChange}
              required
              className="modern-input h-11"
            />
          </div>

          {/* Password Protection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Password Protection
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      PRO
                    </span>
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
              {password ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400">Protected</span>
                  <button
                    type="button"
                    onClick={handleRemovePassword}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!isPremium) {
                      toast.warning("Password protection is a premium feature. Upgrade to PRO to use this feature.");
                      return;
                    }
                    setPasswordDialogOpen(true);
                  }}
                  disabled={!isPremium}
                  className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Password
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex-1 modern-button-primary"
            >
              Create Link
            </Button>
          </div>
        </form>

        {/* Password Dialog */}
        <PasswordDialog
          open={passwordDialogOpen}
          onOpenChange={setPasswordDialogOpen}
          onPasswordSet={handlePasswordSet}
          isPremium={isPremium}
        />
      </DialogContent>
    </Dialog>
  );
}
