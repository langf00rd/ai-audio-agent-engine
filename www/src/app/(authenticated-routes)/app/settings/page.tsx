"use client";

import EmptyState from "@/components/empty-state";
import ConnectionsSettingsTabView from "@/components/tab-views/settings/connections";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useBusiness from "@/hooks/use-business";
import { BUSINESS_FORM_STEPS, COOKIE_KEYS } from "@/lib/constants";
import { fetchAuthTokens } from "@/lib/services/auth-tokens";
import { useProviders } from "@/lib/services/mutations/providers";
import { APIResponse, AuthToken, Business, User } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TABS = ["Your account", "Connections", "Business"];

export default function SettingsPage() {
  const { getGoogleProviderKeys } = useProviders();
  const { updateBusinessMutation } = useBusiness();

  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data: authTokens, isFetching } = useQuery<APIResponse<AuthToken>>({
    queryKey: ["auth-tokens", currentBusiness?.id],
    queryFn: () => fetchAuthTokens(String(currentBusiness?.id)),
    enabled: !!currentBusiness?.id,
  });

  const user = getCookie<User>(COOKIE_KEYS.user, {
    parse: true,
  });

  const [formData, setFormData] = useState<Business>(
    (currentBusiness as Business) || {
      name: "",
      industry: "",
      description: "",
      contact_info: {
        phone: "",
        email: "",
      },
    },
  );

  const updateNestedField = (fieldPath: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (fieldPath.startsWith("contact_info_")) {
        const key = fieldPath.replace("contact_info_", "");
        return {
          ...updated,
          contact_info: {
            ...updated.contact_info,
            [key]: value,
          },
        };
      }
      return {
        ...updated,
        [fieldPath]: value,
      };
    });
  };

  // helper to safely get field value from nested structure
  const getFieldValue = (fieldPath: string): string => {
    if (fieldPath.startsWith("contact_info_")) {
      const key = fieldPath.replace("contact_info_", "");
      return (
        formData.contact_info?.[key as keyof typeof formData.contact_info] || ""
      );
    }
    return (formData[fieldPath as keyof Business] as string) || "";
  };

  return (
    <div className="space-y-4">
      <H1>Settings</H1>
      <Tabs defaultValue={TABS[1]}>
        <TabsList>
          {TABS.map((a) => (
            <TabsTrigger key={a} value={a}>
              {a}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TABS[0]}>
          <EmptyState title="Coming soon..." />
        </TabsContent>
        <TabsContent value={TABS[1]}>
          <ConnectionsSettingsTabView />
          {/*<SettingItem
            title="Allow Agents to Follow Up Automatically"
            description="Grants your agents permission to initiate follow-ups with customers using their provided contact details."
          >
            <Button
              variant="outline"
              isLoading={getGoogleProviderKeys.isPending}
              onClick={() => getGoogleProviderKeys.mutate()}
            >
              <Image src={GmailIcon} alt="gmail icon" width={18} height={18} />
              Connect
            </Button>*/}
          {/*{user?.google_gmail_provider_connected ? (
              <Button variant="outline" disabled>
                <Image
                  src={GmailIcon}
                  alt="gmail icon"
                  width={18}
                  height={18}
                />
                Connected
              </Button>
            ) : (
              <Button
                variant="outline"
                isLoading={getGoogleProviderKeys.isPending}
                onClick={() => getGoogleProviderKeys.mutate()}
              >
                <Image
                  src={GmailIcon}
                  alt="gmail icon"
                  width={18}
                  height={18}
                />
                Connect
              </Button>
            )}*/}
          {/*</SettingItem>*/}
        </TabsContent>
        <TabsContent value={TABS[2]} className="max-w-[500px]">
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              updateBusinessMutation.mutate(formData);
            }}
          >
            {BUSINESS_FORM_STEPS.map((step) => (
              <div key={step.title} className="space-y-4 pb-6">
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="opacity-65">{step.description}</p>
                </div>
                {step.fields.map((field) => (
                  <fieldset key={field.label} className="space-y-2">
                    <Label htmlFor={field.value}>{field.label}</Label>
                    {field.inputType === "textarea" ? (
                      <Textarea
                        id={field.value}
                        name={field.value}
                        value={getFieldValue(field.value)}
                        onChange={(e) =>
                          updateNestedField(field.value, e.target.value)
                        }
                      />
                    ) : field.inputType === "select" ? (
                      <Select
                        value={getFieldValue(field.value)}
                        onValueChange={(val) =>
                          updateNestedField(field.value, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {(field as { options: string[] }).options.map(
                            (opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.value}
                        name={field.value}
                        type={field.type || "text"}
                        value={getFieldValue(field.value)}
                        onChange={(e) =>
                          updateNestedField(field.value, e.target.value)
                        }
                      />
                    )}
                  </fieldset>
                ))}
              </div>
            ))}
            <Button disabled={updateBusinessMutation.isPending} type="submit">
              {updateBusinessMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
