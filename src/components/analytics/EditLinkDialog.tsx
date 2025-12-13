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
import { PasswordDialog } from "../../components/PasswordDialog";
import { UserLink } from "@/components/analytics/Links";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { useQueryClient } from "@tanstack/react-query";

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: UserLink;
  onSuccess?: () => void;
}

export function EditLinkDialog({
  open,
  onOpenChange,
  link,
  onSuccess,
}: EditLinkDialogProps) {
  const {
    id,
    longLink: initialLongLink,
    password: initialPassword,
    tags = [],
  } = link;
  const [editUrl, setEditUrl] = useState(initialLongLink);
  const [localPassword, setLocalPassword] = useState<string | null>(null);
  const [shouldRemovePassword, setShouldRemovePassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const user = userStorage.getState().user;
  const isPremium = user.userType === "PREMIUM";
  const initialHasPassword = !!initialPassword;
  const queryClient = useQueryClient();

  const { data: userTags = [] } = useTags();
  const createTagMutation = useCreateTag();

  useEffect(() => {
    setEditUrl(link.longLink);
    setLocalPassword(null);
    setShouldRemovePassword(false);
    setSelectedTags(link.tags?.map((t) => t.name) || []);
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
      toast.warning(
        "Password protection is a premium feature. Upgrade to PRO to use this feature."
      );
      return;
    }
    setPasswordDialogOpen(true);
  };

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagNameToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagNameToRemove));
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newTagInput.trim()) {
        const trimmed = newTagInput.trim().toLowerCase();
        const exists = userTags.some((t: any) => t.name === trimmed);
        if (!exists) {
          createTagMutation.mutate(trimmed, {
            onSuccess: () => addTag(trimmed),
            onError: () => toast.error("Failed to create tag"),
          });
        } else {
          addTag(trimmed);
        }
      }
    }
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

    const payload: {
      id: string;
      longLink: string;
      password?: string;
      removePassword?: boolean;
      tags?: string[];
    } = {
      id,
      longLink: editUrl,
    };

    if (localPassword !== null) {
      payload.password = localPassword;
    }

    if (shouldRemovePassword) {
      payload.removePassword = true;
    }

    payload.tags = selectedTags;

    toast.promise(
      async () => {
        setIsPending(true);
        try {
          const result = await axios.patch("/api/link", payload);
          console.log("Link updated: ", result.data);

          queryClient.setQueryData<UserLink[]>(["links"], (old) => {
            if (!old) return [];
            return old.map((link) =>
              link.id === id ? { ...link, ...result.data.data } : link
            );
          });

          onSuccess?.();
          onOpenChange(false);
          // Reset states
          setEditUrl(initialLongLink);
          setLocalPassword(null);
          setShouldRemovePassword(false);
          setSelectedTags([]);
          return { message: "Link updated" };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error || "Unexpected error occurred.";
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
        <DialogContent className="w-[90%] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 text-lg md:text-xl">
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
                    &quot;PRO&quot;
                  </span>
                </div>
                {getPasswordSection()}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (optional, e.g., &quot;campaign&quot;)</Label>
              <div className="flex flex-wrap items-center gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add tag and press Enter"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleNewTagKeyDown}
                  disabled={isPending}
                  className="flex-1 min-w-[200px] border-2 border-black rounded-lg"
                />
              </div>
              <p className="text-xs text-gray-500">
                Existing tags:{" "}
                {userTags.map((t: any) => t.name).join(", ") || "None"}
              </p>
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
