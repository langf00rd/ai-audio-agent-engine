"use client";

import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.app.agents.index);
  }, [router]);
  return null;
}
