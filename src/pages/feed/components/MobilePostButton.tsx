import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function MobilePostButton() {
  return (
    <Button 
      className="md:hidden fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg" 
      size="icon"
    >
      <PlusIcon className="h-6 w-6" />
    </Button>
  );
}