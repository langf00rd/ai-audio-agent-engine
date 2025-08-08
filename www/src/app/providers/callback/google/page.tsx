"use client";

import { ErrorText } from "@/components/typography";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { fetchGoogleProviderOauthCredentials } from "@/lib/services/providers";
import { APIResponse, Business } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data, isFetching, error } = useQuery<
    APIResponse<{ access_token: string; refresh_token: string }>
  >({
    queryKey: ["callback", "google", code, currentBusiness?.id],
    queryFn: () =>
      fetchGoogleProviderOauthCredentials(
        String(code),
        currentBusiness?.id as string,
      ),
    enabled: !!code && !!currentBusiness?.id,
  });

  if (data) {
    toast("Connection successful");
    window.location.href = ROUTES.app.settings;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-32">
      {isFetching && (
        <>
          <Loader2 className="animate-spin" />
          <p>Hold on, we&apos;re getting things ready...</p>
        </>
      )}
      {error && <ErrorText>{error.message}</ErrorText>}
    </div>
  );
}
