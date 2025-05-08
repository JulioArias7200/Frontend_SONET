import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

export function NavItem({ icon, label, to }: NavItemProps) {
  return (
    <Button variant="ghost" className="w-full justify-start font-medium" asChild>
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  );
}