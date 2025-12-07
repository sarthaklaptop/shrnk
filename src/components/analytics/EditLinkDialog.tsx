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
import { FaLink } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import validUrl from "valid-url";
import axios from "axios";
import { userStorage } from "@/store/link";
import { PasswordDialog } from "../../components/PasswordDialog"; // Adjust path as needed

import { UserLink } from "@/components/analytics/Links"; // Adjust path to import UserLink type

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: UserLink;
  onSuccess?: () => void;
}

export function EditLinkDialog({ open, onOpenChange, link, onSuccess }: EditLinkDialogProps) {
  const { id, longLink: initialLongLink, password: initialPassword } = link;
  const [editUrl, setEditUrl] = useState(initialLongLink);
  const [localPassword, setLocalPassword] = useState<string | null>(null);
  const [shouldRemovePassword, setShouldRemovePassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const user = userStorage.getState().user;
  const isPremium = user.userType === "PREMIUM";
  const initialHasPassword = !!initialPassword;

  useEffect(() => {
    setEditUrl(link.longLink);
    setLocalPassword(null);
    setShouldRemovePassword(false);
  }, [link]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUrl(e.target.value);
  };

  const handlePasswordSet = (pwd: string) => {
    setLocalPassword(pwd);
    if (initialHasPassword && shouldRemovePassword) {
      setShouldRemovePassword(false); // Cancel remove if adding/changing
    }
    setPasswordDialogOpen(false);
  };

  const handleRemovePassword = () => {
    setLocalPassword(null);
    setShouldRemovePassword(true);
  };

  const handleUndoRemove = () => {
    setShouldRemovePassword(false);
  };

  const handlePasswordAction = () => {
    if (!isPremium) {
      toast.warning("Password protection is a premium feature. Upgrade to PRO to use this feature.");
      return;
    }
    setPasswordDialogOpen(true);
  };

  const getPasswordSection = () => {
    if (localPassword) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Password set</span>
          <button
            type="button"
            onClick={handleRemovePassword}
            disabled={isPending}
            className="text-xs text-red-600 hover:text-red-800 font-medium border-[1px] border-red-600 px-2 py-1 rounded hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      );
    } else if (shouldRemovePassword && initialHasPassword) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Password removed</span>
          <button
            type="button"
            onClick={handleUndoRemove}
            disabled={isPending}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium border-[1px] border-blue-600 px-2 py-1 rounded hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
        </div>
      );
    } else if (initialHasPassword) {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePasswordAction}
            disabled={!isPremium || isPending}
            className="text-xs font-medium border-[1px] border-black px-1 py-1 rounded bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={handleRemovePassword}
            disabled={isPending}
            className="text-xs text-red-600 hover:text-red-800 font-medium border-[1px] border-red-600 px-1 py-1 rounded bg-white hover:bg-red-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Password
          </button>
        </div>
      );
    } else {
      return (
        <button
          type="button"
          onClick={handlePasswordAction}
          disabled={!isPremium || isPending}
          className="text-xs font-medium border-[1px] border-black px-3 py-1.5 rounded bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Password
        </button>
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editUrl) {
      toast("Please enter a URL", {
        description: "URL is required to update the link",
      });
      return;
    }

    if (!validUrl.isUri(editUrl)) {
      toast("Please enter a valid URL");
      return;
    }

    const payload: { id: string; longLink: string; password?: string; removePassword?: boolean } = {
      id,
      longLink: editUrl,
    };

    if (localPassword !== null) {
      payload.password = localPassword;
    }

    if (shouldRemovePassword) {
      payload.removePassword = true;
    }

    toast.promise(
      async () => {
        setIsPending(true);
        try {
          const result = await axios.patch("/api/link", payload);
          console.log("Link updated: ", result.data);
          onSuccess?.();
          onOpenChange(false);
          // Reset states
          setEditUrl(initialLongLink);
          setLocalPassword(null);
          setShouldRemovePassword(false);
          return { message: "Link updated" };
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || "Unexpected error occurred.";
          throw new Error(errorMessage);
        } finally {
          setIsPending(false);
        }
      },
      {
        loading: "Updating link...",
        success: "Link updated successfully",
        error: (err) => err.message,
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1">
              <FaLink /> Edit link
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              Destination URL <FaRegQuestionCircle />
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            {/* Full width URL input */}
            <div className="space-y-2">
              <Label htmlFor="link" className="sr-only">
                Destination URL
              </Label>
              <Input
                id="link"
                placeholder="https://example.com/very/long/url..."
                value={editUrl}
                onChange={handleUrlChange}
                required
                disabled={isPending}
                className="w-full border-2 border-black rounded-lg"
              />
            </div>

            {/* Password Protection Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border-[1px] border-gray-300 rounded-lg bg-gray-50 gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Password Protection
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    PRO
                  </span>
                </div>
                {getPasswordSection()}
              </div>
            </div>

            {/* Update Button */}
            <DialogClose asChild>
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full border-2 border-black bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogClose>
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
    </>
  );
}