import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { signIn } from "next-auth/react";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild className="w-fit p-2 h-fit">
        <Button variant="link" className="bg-black text-white text-xs rounded-full">
          Expires in 30 minutes
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          {/* <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar> */}
          <div className="space-y-1">
            {/* <h4 className="text-sm font-semibold">@nextjs</h4> */}
            <p className="text-sm">
              To prevent abuse, we automatically delete unclaimed links after 30
              minutes. To claim this link, simply sign up for a free account.
            </p>
            <button
                className="bg-black text-white w-full p-1 rounded-md text-sm hover:border-2"
                onClick={() => signIn("google")}
            >
                Create Account
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
