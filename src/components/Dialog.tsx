import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaLink } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";
import validUrl from "valid-url";
import axios from "axios";
import { userStorage } from "@/store/link";

export function DialogCloseButton() {
  const [urlInput, setUrlInput] = useState(""); 
  const [response, setResponse] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);  
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
      const result = await axios.post("/api/link", { longLink: urlInput });
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);
      const currentCredits = userStorage.getState().user.credits;
      if (currentCredits !== null) {
        userStorage.getState().updateCredits(currentCredits - 1);
      }
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
      setResponse(result.data.data.shortLink);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Unexpected error occurred.";
      toast.warning(errorMessage);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        > 
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <FaLink /> New link
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            Destination URL <FaRegQuestionCircle />
          </DialogDescription>
        </DialogHeader>

        {/* ---------- 80 / 20 FORM ---------- */}
        <form onSubmit={onSubmit} className="grid grid-cols-5 gap-2 mt-4">
          {/* INPUT – 4 columns = 80% */}
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            placeholder="https://example.com/very/long/url..."
            value={urlInput}
            onChange={handleChange}
            required
            className="col-span-4 w-full"
          />

          {/* BUTTON – 1 column = 20% */}
          <DialogClose asChild>
            <Button type="submit" size="sm" className="col-span-1 w-full">
              Create
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
