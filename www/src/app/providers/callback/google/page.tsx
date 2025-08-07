"use client";

import { ErrorText } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import { fetchGoogleProviderOauthCredentials } from "@/lib/services/providers";
import { APIResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { data, isFetching, error } = useQuery<
    APIResponse<{ access_token: string; refresh_token: string }>
  >({
    queryKey: ["callback", "google", code],
    queryFn: () => fetchGoogleProviderOauthCredentials(String(code)),
    enabled: !!code,
  });

  if (data) {
    toast("Connection successful");
    window.location.href = ROUTES.auth.signIn;
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
