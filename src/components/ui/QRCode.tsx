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
  
  const link = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${QRUrl}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
          <div className=" flex items-center hover:font-bold m-[1px] transition-all duration-75 justify-between w-full gap-2">
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


