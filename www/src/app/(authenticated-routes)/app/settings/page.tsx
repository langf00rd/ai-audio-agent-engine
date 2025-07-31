"use client";

import EmptyState from "@/components/empty-state";
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
import { Business } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage() {
  const { updateBusinessMutation } = useBusiness();
  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });
  const [formData, setFormData] = useState<
    Record<string, Record<string, string | Record<string, string>> | string>
  >(
    (currentBusiness as unknown as Record<
      string,
      Record<string, string | Record<string, string>>
    >) || {},
  );

  return (
    <div className="space-y-4">
      <H1>Settings</H1>
      <Tabs defaultValue={TABS[0]}>
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
        <TabsContent value={TABS[1]} className="max-w-[500px]">
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              updateBusinessMutation.mutate(formData as unknown as Business);
            }}
          >
            {BUSINESS_FORM_STEPS.map((a) => (
              <div key={a.title} className="space-y-4 pb-6">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="opacity-65">{a.description}</p>
                </div>
                {a.fields.map((field) => (
                  <fieldset key={field.label}>
                    <Label htmlFor={field.value}>{field.label}</Label>
                    {field.inputType === "textarea" ? (
                      <Textarea
                        name={field.value}
                        defaultValue={formData[field.value] as string}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            [field.value]: e.target.value,
                          }));
                        }}
                      />
                    ) : field.inputType === "select" ? (
                      <Select
                        name={field.value}
                        defaultValue={formData[field.value] as string}
                        onValueChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.value]: val,
                          }))
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
                      <>
                        <Input
                          name={field.value}
                          type={field.type || "text"}
                          defaultValue={
                            field.value === "contact_info_phone"
                              ? ((
                                  formData.contact_info as Business["contact_info"]
                                ).phone as string)
                              : field.value === "contact_info_email"
                                ? ((
                                    formData.contact_info as Business["contact_info"]
                                  ).email as string)
                                : (formData[field.value] as string)
                          }
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [field.value]: e.target.value,
                            }))
                          }
                        />
                      </>
                    )}
                  </fieldset>
                ))}
              </div>
            ))}
            <Button>Update</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TABS = ["Your account", "Business"];
