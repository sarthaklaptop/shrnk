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
import { MdQrCodeScanner } from "react-icons/md";
import Image from "next/image";

export function QRCodeDialog({QRUrl}: {QRUrl: string}) {
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
  
  const link = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${QRUrl}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
          <div className=" flex items-center justify-between w-full gap-2">
            QR Code <MdQrCodeScanner/>
          </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex gap-1"> 
            QR Code Preview <FaRegQuestionCircle />
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg">

            <Image src={link} width={150} height={150} alt="QR Code" />            
            
        </div>
      </DialogContent>
    </Dialog>
  );
}


