import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchGoogleProviderOauthURL } from "../providers";

export function useProviders() {
  const getGoogleProviderKeys = useMutation({
    mutationFn: () => {
      return fetchGoogleProviderOauthURL();
    },
    onSuccess: (data) => {
      window.location.href = data.data;
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return { getGoogleProviderKeys };
}
