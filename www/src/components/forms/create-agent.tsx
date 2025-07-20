"use client";

import { Label } from "@/components/ui/label";
import { createAgent, updateAgent } from "@/lib/services/agent";
import {
  AgentConfig,
  AgentFAQ,
  AgentPricing,
  AgentService,
  KV,
} from "@/lib/types";
import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CreateAgentForm(props: {
  data?: AgentConfig;
  onSubmitSuccess?: (data: AgentConfig) => void;
  onSubmitError?: (err: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<AgentService[]>([
    { name: "", description: "", pricing: [{ amount: 0, currency: "" }] },
  ]);
  const [faqs, setFaqs] = useState<AgentFAQ[]>([{ question: "", answer: "" }]);
  const [supportContact, setSupportContact] = useState<KV[]>([
    { key: "email", value: "" },
    { key: "phone", value: "" },
  ]);
  const [customInteractions, setCustomInteractions] = useState<KV[]>([
    { key: "on_rejection", value: "" },
    { key: "on_complaint", value: "" },
  ]);

  // Service handlers
  const handleServiceChange = (i: number, field: string, value: string) => {
    const updated = [...services];
    updated[i][field] = value;
    setServices(updated);
  };

  const handlePricingChange = (
    i: number,
    j: number,
    field: string,
    value: string,
  ) => {
    const updated = [...services]; // @ts-expect-error: ...
    updated[i].pricing[j][field as keyof AgentPricing] = value;
    setServices(updated);
  };

  const addService = () => {
    setServices([
      // @ts-expect-error: ...
      ...services,
      // @ts-expect-error: ...
      { name: "", description: "", pricing: [{ amount: "", currency: "" }] },
    ]);
  };

  const removeService = (i: number) => {
    const updated = services.filter((_, idx) => idx !== i);
    setServices(updated);
  };

  const addPricing = (serviceIdx: number) => {
    const updated = [...services];
    updated[serviceIdx].pricing.push({ amount: 0, currency: "" });
    setServices(updated);
  };

  const removePricing = (serviceIdx: number, priceIdx: number) => {
    const updated = [...services];
    updated[serviceIdx].pricing = updated[serviceIdx].pricing.filter(
      (_, idx) => idx !== priceIdx,
    );
    setServices(updated);
  };

  // faq handlers
  const handleFaqChange = (i: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[i][field as keyof AgentFAQ] = value;
    setFaqs(updated);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));

  // kv handlers
  const handleKVChange = (
    setter: unknown,
    list: KV[],
    i: number,
    field: string,
    value: string,
  ) => {
    const updated = [...list];
    updated[i][field as keyof KV] = value;
    // @ts-expect-error: ...
    setter(updated);
  };

  const addKV = (setter: unknown, list: KV[]) =>
    // @ts-expect-error: ...
    setter([...list, { key: "", value: "" }]);
  const removeKV = (setter: unknown, list: KV[], i: number) =>
    // @ts-expect-error: ...
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
        // @ts-expect-error: ...
        kvMap.get(idx)![field] = String(val);
      });

      const result: Record<string, string> = {};
      for (const { key, value } of kvMap.values()) {
        if (key) result[key] = value;
      }
      return result;
    };

    const data = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      business_name: form.get("business_name") as string,
      business_slogan: form.get("business_slogan") as string,
      brand_voice: form.get("brand_voice") as string,
      support_contact: extractKV("support_contact"),
      custom_interactions: extractKV("custom_interactions"),
      service: [], // handled below
      faqs: [], // handled below
      other_info: form.get("other_info") as string,
    } as unknown as AgentConfig;

    // extract services
    const serviceMap = new Map<number, unknown>();
    form.forEach((value, key) => {
      const match = key.match(/^services\[(\d+)\]\.([\w\[\]\.]+)$/);
      if (match) {
        const [_, idxStr, field] = match;
        const idx = parseInt(idxStr);
        if (!serviceMap.has(idx)) serviceMap.set(idx, { pricing: [] });
        const service = serviceMap.get(idx);
        if (field.startsWith("pricing[")) {
          const pricingMatch = field.match(
            /pricing\[(\d+)\]\.(amount|currency)/,
          );
          if (pricingMatch) {
            const [__, pIdxStr, pField] = pricingMatch;
            const pIdx = parseInt(pIdxStr);
            // @ts-expect-error: ...
            if (!service.pricing[pIdx])
              // @ts-expect-error: ...
              service.pricing[pIdx] = { amount: "", currency: "" };
            // @ts-expect-error: ...
            service.pricing[pIdx][pField] = value;
          }
        } else {
          // @ts-expect-error: ...
          service[field] = value;
        }
      }
    });
    data.service = Array.from(serviceMap.values()).map((s) => ({
      // @ts-expect-error: ...
      ...s,
      // @ts-expect-error: ...
      pricing: s.pricing.map((p: unknown) => ({
        // @ts-expect-error: ...
        amount: parseFloat(p.amount),
        // @ts-expect-error: ...
        currency: p.currency,
      })),
    }));

    // extract FAQs
    const faqMap = new Map<number, unknown>();
    form.forEach((value, key) => {
      const match = key.match(/^faqs\[(\d+)\]\.(question|answer)$/);
      if (match) {
        const [_, idxStr, field] = match;
        const idx = parseInt(idxStr);
        if (!faqMap.has(idx)) faqMap.set(idx, {});
        // @ts-expect-error: ...
        faqMap.get(idx)[field] = value;
      }
    });
    // @ts-expect-error: ...
    data.faqs = Array.from(faqMap.values());
    if (props.data) handleCreateOrUpdateAgent("UPDATE", data);
    else handleCreateOrUpdateAgent("CREATE", data);
  };

  async function handleCreateOrUpdateAgent(
    type: "CREATE" | "UPDATE",
    data: AgentConfig,
  ) {
    try {
      setIsLoading(true);
      const response =
        type === "CREATE"
          ? await createAgent(data)
          : await updateAgent({ ...props.data, ...data });
      props.onSubmitSuccess?.(response.data);
    } catch (err) {
      props.onSubmitError?.((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!props.data) return;
    setServices(
      props.data.service ?? [
        { name: "", description: "", pricing: [{ amount: "", currency: "" }] },
      ],
    );
    setFaqs(props.data.faqs ?? [{ question: "", answer: "" }]);
    setSupportContact(
      props.data.support_contact
        ? Object.entries(props.data.support_contact).map(([key, value]) => ({
            key,
            value,
          }))
        : [
            { key: "email", value: "" },
            { key: "phone", value: "" },
          ],
    );
    setCustomInteractions(
      props.data.custom_interactions
        ? Object.entries(props.data.custom_interactions).map(
            ([key, value]) => ({ key, value }),
          )
        : [
            { key: "on_rejection", value: "" },
            { key: "on_complaint", value: "" },
          ],
    );
  }, [props.data]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* agent core info */}
      <fieldset>
        <Label>Name</Label>
        <Input
          defaultValue={props.data?.name ?? ""}
          placeholder="Alec from Salesforce"
          required
          name="name"
        />
      </fieldset>
      <fieldset>
        <Label>Description</Label>
        <Textarea
          defaultValue={props.data?.description ?? ""}
          required
          name="description"
        />
      </fieldset>
      <fieldset>
        <Label>Business Name</Label>
        <Input
          defaultValue={props.data?.business_name ?? ""}
          required
          name="business_name"
          placeholder="Salesforce"
        />
      </fieldset>
      <fieldset>
        <Label>Business Slogan</Label>
        <Input
          defaultValue={props.data?.business_slogan ?? ""}
          required
          name="business_slogan"
          placeholder="For the love of the game"
        />
      </fieldset>
      <fieldset>
        <Label>Brand Voice</Label>
        <Input
          defaultValue={props.data?.brand_voice ?? ""}
          required
          name="brand_voice"
          placeholder="Empathy"
        />
      </fieldset>
      {/* support contact */}
      <div>
        <Label className="text-[16px] font-semibold mt-10 mb-2">
          Support Contact
        </Label>
        {supportContact.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder="Instagram"
              value={item.key}
              name={`support_contact[${i}].key`}
              onChange={(e) =>
                handleKVChange(
                  setSupportContact,
                  supportContact,
                  i,
                  "key",
                  e.target.value,
                )
              }
            />
            <Input
              placeholder="@salesforce"
              value={item.value}
              name={`support_contact[${i}].value`}
              onChange={(e) =>
                handleKVChange(
                  setSupportContact,
                  supportContact,
                  i,
                  "value",
                  e.target.value,
                )
              }
            />
            <Button
              type="button"
              variant="destructive-secondary"
              onClick={() => removeKV(setSupportContact, supportContact, i)}
            >
              <X />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => addKV(setSupportContact, supportContact)}
        >
          + Add Contact
        </Button>
      </div>
      {/* custom interactions */}
      <div>
        <Label className="text-[16px] font-semibold mt-10 mb-2">
          Custom Interactions
        </Label>
        {customInteractions.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder="On rejection"
              value={item.key}
              name={`custom_interactions[${i}].key`}
              onChange={(e) =>
                handleKVChange(
                  setCustomInteractions,
                  customInteractions,
                  i,
                  "key",
                  e.target.value,
                )
              }
            />
            <Input
              placeholder="Recommend the 14% discount package"
              value={item.value}
              name={`custom_interactions[${i}].value`}
              onChange={(e) =>
                handleKVChange(
                  setCustomInteractions,
                  customInteractions,
                  i,
                  "value",
                  e.target.value,
                )
              }
            />
            <Button
              variant="destructive-secondary"
              type="button"
              onClick={() =>
                removeKV(setCustomInteractions, customInteractions, i)
              }
            >
              <X />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => addKV(setCustomInteractions, customInteractions)}
        >
          + Add Interaction
        </Button>
      </div>
      {/* services */}
      <div>
        <Label className="text-[16px] font-semibold mt-10 mb-2">Services</Label>
        {services.map((service, i) => (
          <div key={i} className="space-y-2 mb-4 rounded">
            <Input
              required
              placeholder="Service Name"
              name={`services[${i}].name`}
              value={service.name}
              onChange={(e) => handleServiceChange(i, "name", e.target.value)}
            />
            <Textarea
              required
              placeholder="Description"
              name={`services[${i}].description`}
              value={service.description}
              onChange={(e) =>
                handleServiceChange(i, "description", e.target.value)
              }
            />
            <Label>Pricing</Label>
            {service.pricing.map((p, j) => (
              <div key={j} className="flex gap-2 mb-2">
                <Input
                  required
                  type="number"
                  placeholder="Amount"
                  name={`services[${i}].pricing[${j}].amount`}
                  value={p.amount}
                  onChange={(e) =>
                    handlePricingChange(i, j, "amount", e.target.value)
                  }
                />
                <Input
                  required
                  placeholder="Currency"
                  name={`services[${i}].pricing[${j}].currency`}
                  value={p.currency}
                  onChange={(e) =>
                    handlePricingChange(i, j, "currency", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive-secondary"
                  onClick={() => removePricing(i, j)}
                >
                  <X />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => addPricing(i)}
              >
                + Add Pricing
              </Button>
              <Button
                size="sm"
                type="button"
                variant="destructive-secondary"
                onClick={() => removeService(i)}
              >
                <X /> Service
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={addService}
        >
          + Add Service
        </Button>
      </div>
      {/* faqs */}
      <div>
        <Label className="text-[16px] font-semibold mt-10 mb-2">FAQs</Label>
        {faqs.map((faq, i) => (
          <div key={i} className="space-y-2 mb-4 rounded">
            <Input
              required
              placeholder="FAQ Question"
              name={`faqs[${i}].question`}
              value={faq.question}
              onChange={(e) => handleFaqChange(i, "question", e.target.value)}
            />
            <Textarea
              required
              placeholder="FAQ Answer"
              name={`faqs[${i}].answer`}
              value={faq.answer}
              onChange={(e) => handleFaqChange(i, "answer", e.target.value)}
            />
            <Button
              size="sm"
              type="button"
              variant="destructive-secondary"
              onClick={() => removeFaq(i)}
            >
              <X /> FAQ
            </Button>
          </div>
        ))}
        <Button size="sm" type="button" variant="secondary" onClick={addFaq}>
          + Add FAQ
        </Button>
      </div>
      <fieldset>
        <Label>Other Info</Label>
        <Textarea
          defaultValue={props.data?.other_info ?? ""}
          name="other_info"
        />
      </fieldset>
      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? "Creating..."
          : props.data
            ? "Save changes"
            : "Create agent"}
      </Button>
    </form>
  );
}
