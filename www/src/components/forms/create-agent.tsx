/* eslint-disable */

"use client";

import { Label } from "@/components/ui/label";
import { useAgents } from "@/hooks/use-agent";
import { COOKIE_KEYS } from "@/lib/constants";
import { Agent, Business, KV } from "@/lib/types";
import { cn, getCookie } from "@/lib/utils";
import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CreateAgentForm(props: {
  data?: Agent;
  onSubmitSuccess?: (data: Agent) => void;
  onSubmitError?: (err: string) => void;
  className?: string;
}) {
  const { createAgentMutation, updateAgentMutation } = useAgents();
  const [isLoading, setIsLoading] = useState(false);
  const [customReactions, setCustomReactions] = useState<KV[]>([
    { key: "on rejection", value: "" },
  ]);

  const handleKVChange = (
    setter: unknown,
    list: KV[],
    i: number,
    field: string,
    value: string,
  ) => {
    const updated = [...list];
    updated[i][field as keyof KV] = value;
    // @ts-expect-error
    setter(updated);
  };

  const addKV = (setter: unknown, list: KV[]) =>
    // @ts-expect-error
    setter([...list, { key: "", value: "" }]);
  const removeKV = (setter: unknown, list: KV[], i: number) =>
    // @ts-expect-error
    setter(list.filter((_, idx) => idx !== i));

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = new FormData(evt.currentTarget);

    const extractKV = (prefix: string): Record<string, string> => {
      const kvMap = new Map<number, { key: string; value: string }>();
      form.forEach((val, key) => {
        const match = key.match(
          new RegExp(`^${prefix}\\[(\\d+)\\]\\.(key|value)$`),
        );
        if (!match) return;
        const idx = parseInt(match[1]);
        const field = match[2];
        if (!kvMap.has(idx)) kvMap.set(idx, { key: "", value: "" });
        // @ts-expect-error
        kvMap.get(idx)![field] = String(val);
      });
      const result: Record<string, string> = {};
      for (const { key, value } of kvMap.values()) {
        if (key) result[key] = value;
      }
      return result;
    };

    const business = getCookie<Business[]>(COOKIE_KEYS.business, {
      parse: true,
    });

    const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
      parse: true,
    });

    const data = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      custom_reactions: extractKV("custom_reactions"),
      business_id: currentBusiness?.id,
    } as Agent;

    if (props.data) handleCreateOrUpdateAgent("UPDATE", data);
    else handleCreateOrUpdateAgent("CREATE", data);
  };

  async function handleCreateOrUpdateAgent(
    type: "CREATE" | "UPDATE",
    data: Agent,
  ) {
    const response =
      type === "CREATE"
        ? createAgentMutation.mutate(data, {
            onSuccess: (data) => props.onSubmitSuccess?.(data.data),
          })
        : updateAgentMutation.mutate(
            { ...props.data, ...data },
            {
              onSuccess: (data) => props.onSubmitSuccess?.(data.data),
            },
          );
  }

  useEffect(() => {
    if (!props.data) return;
    setCustomReactions(
      props.data.custom_reactions
        ? Object.entries(props.data.custom_reactions).map(([key, value]) => ({
            key,
            value,
          }))
        : [{ key: "on rejection", value: "" }],
    );
  }, [props.data]);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-20", props.className)}>
      {/* agen metadata */}
      <div className="space-y-4">
        {/* <CardTitle>Agent Metadata</CardTitle> */}
        <fieldset className="space-y-1">
          <Label>Name</Label>
          <Input
            defaultValue={props.data?.name ?? ""}
            placeholder="Jenny from Acme"
            required
            name="name"
          />
        </fieldset>
        <fieldset className="space-y-1">
          <Label>Description</Label>
          <Textarea
            defaultValue={props.data?.description ?? ""}
            name="description"
            placeholder="Introduce visitors to our company and get them to try our services"
          />
        </fieldset>
      </div>
      {/* custom reactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-medium">Custom Reactions</h2>
            <p className="max-w-[90%] text-sm opacity-60">
              Choose how your sales agent should respond in an event of adverse
              customer interaction
            </p>
          </div>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => addKV(setCustomReactions, customReactions)}
          >
            + Add Another
          </Button>
        </div>
        <div className="space-y-8">
          {customReactions.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="on rejection"
                value={item.key}
                name={`custom_reactions[${i}].key`}
                onChange={(e) =>
                  handleKVChange(
                    setCustomReactions,
                    customReactions,
                    i,
                    "key",
                    e.target.value,
                  )
                }
              />
              <Input
                placeholder="Say something polite"
                value={item.value}
                name={`custom_reactions[${i}].value`}
                onChange={(e) =>
                  handleKVChange(
                    setCustomReactions,
                    customReactions,
                    i,
                    "value",
                    e.target.value,
                  )
                }
              />
              <Button
                type="button"
                variant="destructive-secondary"
                onClick={() => removeKV(setCustomReactions, customReactions, i)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 py-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : props.data ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
