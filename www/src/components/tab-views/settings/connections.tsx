import GmailIcon from "@/components/images/gmail.svg";
import GoogleDocsIcon from "@/components/images/google-docs.svg";
import HubspotIcon from "@/components/images/hubspot.svg";
import SalesforceIcon from "@/components/images/salesforce.svg";
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

  const { data: authTokens } = useQuery<APIResponse<AuthToken>>({
    queryKey: ["auth-tokens", currentBusiness?.id],
    queryFn: () => fetchAuthTokens(String(currentBusiness?.id)),
    enabled: !!currentBusiness?.id,
  });

  return (
    <div className="space-y-10">
      <SettingItem
        title="Link Your Inbox"
        description="Connect your preferred email service so your agent can send and receive messages directly on your behalf"
      >
        {authTokens?.data ? (
          <Button size="sm" variant="outline" disabled>
            <Image src={GmailIcon} alt="gmail icon" width={18} height={18} />
            Connected
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            isLoading={getGoogleProviderKeys.isPending}
            onClick={() => getGoogleProviderKeys.mutate()}
          >
            <Image src={GmailIcon} alt="gmail icon" width={18} height={18} />
            GMAIL
          </Button>
        )}
      </SettingItem>
      <SettingItem
        isComingSoon
        title="Connect CRMs"
        description="Setup your favorite CRM so your agent can store customer profiles, update records, and log interactions automatically"
      >
        <div className="justify-end flex-wrap flex gap-2">
          <Button size="sm" variant="outline" disabled>
            <Image
              src={GoogleDocsIcon}
              alt="google docs icon"
              width={18}
              height={18}
            />
            Google Docs
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Image
              src={HubspotIcon}
              alt="hubspot icon"
              width={18}
              height={18}
            />
            Hubspot
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Image
              src={SalesforceIcon}
              alt="salesforce icon"
              width={18}
              height={18}
            />
            Salesforce
          </Button>
        </div>
      </SettingItem>
    </div>
  );
}
