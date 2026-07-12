"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRequestStatus } from "@/app/actions/provider";
import { toast } from "sonner";
import { Loader2, Navigation, MapPin, CheckCircle, XCircle } from "lucide-react";

type RequestStatus = 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export function UpdateStatusButtons({ requestId, currentStatus }: { requestId: string, currentStatus: RequestStatus }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpdate = async (status: RequestStatus) => {
    setIsLoading(status);
    const result = await updateRequestStatus(requestId, status as any);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    }
    setIsLoading(null);
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {currentStatus === 'accepted' && (
        <Button 
          className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700" 
          onClick={() => handleUpdate('en_route')}
          disabled={isLoading !== null}
        >
          {isLoading === 'en_route' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
          Mark En Route
        </Button>
      )}
      
      {currentStatus === 'en_route' && (
        <Button 
          className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700" 
          onClick={() => handleUpdate('arrived')}
          disabled={isLoading !== null}
        >
          {isLoading === 'arrived' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
          Mark Arrived
        </Button>
      )}

      {currentStatus === 'arrived' && (
        <Button 
          className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700" 
          onClick={() => handleUpdate('in_progress')}
          disabled={isLoading !== null}
        >
          {isLoading === 'in_progress' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wrench className="w-4 h-4 mr-2" />}
          Start Work
        </Button>
      )}

      {(currentStatus === 'in_progress' || currentStatus === 'arrived') && (
        <Button 
          className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-700" 
          onClick={() => handleUpdate('completed')}
          disabled={isLoading !== null}
        >
          {isLoading === 'completed' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          Complete Job
        </Button>
      )}

      <Button 
        variant="outline"
        className="flex-1 min-w-[120px] text-destructive hover:bg-destructive hover:text-white" 
        onClick={() => handleUpdate('cancelled')}
        disabled={isLoading !== null}
      >
        {isLoading === 'cancelled' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
        Cancel Job
      </Button>
    </div>
  );
}

// Ensure Wrench is imported
import { Wrench } from "lucide-react";
