"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { acceptRequest } from "@/app/actions/provider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AcceptJobButton({ requestId }: { requestId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    const result = await acceptRequest(requestId);
    
    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success("Job accepted! Head to Active Jobs to manage it.");
      router.push("/provider/active");
    }
  };

  return (
    <Button 
      className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
      onClick={handleAccept}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      {isLoading ? "Accepting..." : "Accept Job"}
    </Button>
  );
}
