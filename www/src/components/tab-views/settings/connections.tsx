import GmailIcon from "@/components/images/gmail.svg";
import SettingItem from "@/components/setting-item";
import { Button } from "@/components/ui/button";
import { COOKIE_KEYS } from "@/lib/constants";
import { fetchAuthTokens } from "@/lib/services/auth-tokens";
import { useProviders } from "@/lib/services/mutations/providers";
import { APIResponse, AuthToken, Business } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function ConnectionsSettingsTabView() {
  const { getGoogleProviderKeys } = useProviders();

  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data: authTokens, isFetching } = useQuery<APIResponse<AuthToken>>({
    queryKey: ["auth-tokens", currentBusiness?.id],
    queryFn: () => fetchAuthTokens(String(currentBusiness?.id)),
    enabled: !!currentBusiness?.id,
  });

  return (
    <SettingItem
      title="Allow Agents to Follow Up Automatically"
      description="Grants your agents permission to initiate follow-ups with customers using their provided contact details."
    >
      {authTokens?.data ? (
        <Button variant="outline" disabled>
          <Image src={GmailIcon} alt="gmail icon" width={18} height={18} />
          Connected
        </Button>
      ) : (
        <Button
          variant="outline"
          isLoading={getGoogleProviderKeys.isPending}
          onClick={() => getGoogleProviderKeys.mutate()}
        >
          <Image src={GmailIcon} alt="gmail icon" width={18} height={18} />
          Connect
        </Button>
      )}
    </SettingItem>
  );
}
