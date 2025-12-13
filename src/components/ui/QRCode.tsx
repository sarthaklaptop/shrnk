
import { QrCode } from "@ark-ui/react/qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";
import ShrnkLogo from "../../../public/ShrnkLogo.png"
import Image from "next/image";

export function QRCodeDialog({ QRUrl, children }: { QRUrl: string; children?: React.ReactNode }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <div className=" flex items-center hover:font-bold m-[1px] transition-all duration-75 justify-between w-full gap-2">
            QR Code <MdQrCodeScanner />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90%] rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            QR Code Preview <FaRegQuestionCircle className="text-neutral-500" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <QrCode.Root value={`${QRUrl}`} encoding={{ ecc: "H" }} className="w-full max-w-[200px] aspect-square">
            <QrCode.Frame>
              <QrCode.Pattern />
            </QrCode.Frame>
            <QrCode.Overlay>
              <Image
                src={ShrnkLogo} 
                alt="Shrnk Logo"    
                width={50}
                height={50}
                className="rounded-full bg-white p-1"       
              />
            </QrCode.Overlay>
          </QrCode.Root>
        </div>
      </DialogContent>
    </Dialog>
  );
}
