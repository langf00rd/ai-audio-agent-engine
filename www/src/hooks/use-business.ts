"use client";

import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { createBusiness, updateBusiness } from "@/lib/services/business";
import { Business } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function useBusiness() {
  const searchParams = useSearchParams();
  const createBusinessMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      return createBusiness(payload);
    },
    onSuccess: (data) => {
      toast("business created");
      Cookie.set(COOKIE_KEYS.business, JSON.stringify([data.data]));
      Cookie.set(COOKIE_KEYS.currentBusiness, JSON.stringify(data.data));
      window.location.href = searchParams.get("redirect") || ROUTES.app.index;
    },
    onError: (err) => {
      toast(err.message);
    },
  });
  const updateBusinessMutation = useMutation({
    mutationFn: (payload: Business) => {
      return updateBusiness(payload);
    },
    onSuccess: (data) => {
      toast("business updated");
      Cookie.set(COOKIE_KEYS.currentBusiness, JSON.stringify(data.data));
      window.location.reload();
    },
    onError: (err) => {
      toast(err.message);
    },
  });
  return { createBusinessMutation, updateBusinessMutation };
}
