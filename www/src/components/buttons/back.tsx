"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

const ROUTES_TO_HIDE = [ROUTES.app, ROUTES.agent.index];

export default function BackButton() {
  const pathname = usePathname();
  function handleBack() {
    window.history.back();
  }
  if (ROUTES_TO_HIDE.includes(pathname)) return null;
  return (
    <Button variant="ghost" onClick={handleBack}>
      <ChevronLeft /> Back
    </Button>
  );
}
