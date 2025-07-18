"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  function handleBack() {
    window.history.back();
  }
  return (
    <Button variant="ghost" onClick={handleBack}>
      <ChevronLeft /> Back
    </Button>
  );
}
