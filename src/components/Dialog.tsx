import { Copy } from "lucide-react";
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
import { FaLink } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import validUrl from "valid-url";
import { userStorage } from "@/store/link";
import { PasswordDialog } from "./PasswordDialog";
import { useCreateLink } from "@/hooks/useCreateLink";
import { Badge } from "@/components/ui/badge"; // NEW: For tag chips
import { Tag, X } from "lucide-react"; // NEW: Icons
import { useTags, useCreateTag } from "@/hooks/useTags"; // NEW: Hooks for tags

interface DialogCloseButtonProps {
  label?: string;
  className?: string;
}

export function DialogCloseButton({ label = "Create", className = "" }: DialogCloseButtonProps) {
  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // NEW: State for selected tags
  const [newTagInput, setNewTagInput] = useState(""); // NEW: Temp input for new tags
  const user = userStorage.getState().user;
  const isPremium = user.userType === "PREMIUM";
  
  const { mutateAsync: createLink, isPending } = useCreateLink();
  const { data: userTags = [] } = useTags(); // NEW: Fetch existing tags
  const createTagMutation = useCreateTag(); // NEW: For creating new tags

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);  
  };

  const handlePasswordSet = (pwd: string) => {
    setPassword(pwd);
  };

  const handleRemovePassword = () => {
    setPassword(null);
  };
  
  const addTag = (tagName: string) => {
    const trimmed = tagName.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagNameToRemove: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagNameToRemove));
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newTagInput.trim()) {
        // Check if exists, if not create
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

    const payload: { longLink: string; password?: string; tags?: string[] } = { longLink: urlInput };
    if (password) {
      payload.password = password;
    }
    if (selectedTags.length > 0) {
      payload.tags = selectedTags; 
    }

    toast.promise<{ shortLink: string }>(
      (async () => {
        try {
          const newLink = await createLink(payload);
          console.log("Short URL created: ", newLink);
          
          // Update credits
          const currentCredits = userStorage.getState().user.credits;
          if (currentCredits !== null) {
            userStorage.getState().updateCredits(currentCredits - 1);
          }
          
          const shortLink = newLink.shortLink;
          console.log("Short URL created: ", shortLink);
          setResponse(shortLink);
          setUrlInput("");
          setPassword(null);
          setSelectedTags([]); 
          setDialogOpen(false);
          return { shortLink };
        } catch (error: any) {
          throw error;
        }
      })(),
      {
        loading: "Creating link...",
        success: "Short URL created",
        error: (error: any) => error.message || error.response?.data?.error || "Unexpected error occurred.",
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className={`px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ${className}`}
        > 
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 text-lg md:text-xl">
            <FaLink /> New link
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
              value={urlInput}
              onChange={handleChange}
              required
              disabled={isPending}
              className="w-full border-2 border-black rounded-lg"
            />
          </div>

          {/* Password Protection Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border-[1px] border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Password Protection
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                  &quot;PRO&quot;
                </span>
              </div>
              {password ? (
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
                  disabled={!isPremium || isPending}
                  className="text-xs font-medium border-[1px] border-black px-3 py-1.5 rounded bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Password
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (optional, e.g., &quot;campaign&quot;)</Label>
            <div className="flex flex-wrap items-center gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
              Existing tags: {userTags.map((t: any) => t.name).join(", ") || "None"}
            </p>
          </div>

          {/* Create Button */}
          <DialogClose asChild>
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full border-2 border-black bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create"}
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
  );
}