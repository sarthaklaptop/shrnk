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
      console.log("Inside try/catch")
      const result = await axios.post("/api/link", { longLink: urlInput });
      const newLink = { shortLink: result.data.data.shortLink, longLink: urlInput };
      console.log("Short URL created: ", result.data);
      toast("Short URL created");
      console.log("Short URL created: ", result.data.data.shortLink);
      setResponse(result.data.data.shortLink);
    } catch (error) {
      console.error("Error details: ", error);
      toast("Error creating short URL");
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
          <DialogTitle className="flex gap-1"> 
            <FaLink /> New link
          </DialogTitle>
          <DialogDescription className="flex gap-1 items-center">
            Destination URL <FaRegQuestionCircle />
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={urlInput}
              onChange={handleChange}
              required // Add required attribute for form validation
            />
          </div>
          <DialogClose asChild>
            <Button type="submit" size="sm" className="px-3">
              Create Link
            </Button>
          </DialogClose>
        </form>
        {/* <DialogFooter className="sm:justify-start">
          
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
