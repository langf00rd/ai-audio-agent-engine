"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

const form_empty_state = {
  name: "",
  description: "",
  intro_script: "",
  audience: {
    industry: "",
    location: "",
    income_level: "",
  },
  objections_and_responses: {
    too_expensive: "",
    not_interested: "",
  },
};

export default function CreateAgentPage() {
  const router = useRouter();
  const [form, setForm] = useState(form_empty_state);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("audience_")) {
      const key = name.replace("audience_", "");
      setForm((prev) => ({
        ...prev,
        audience: {
          ...prev.audience,
          [key]: value,
        },
      }));
    } else if (name === "too_expensive" || name === "not_interested") {
      setForm((prev) => ({
        ...prev,
        objections_and_responses: {
          ...prev.objections_and_responses,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetch("http://localhost:8000/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("agent created");
      setForm(form_empty_state);
      router.push(ROUTES.agent.index);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Create an agent</h1>
        <p>
          Provide relevant information needed for your AI to work as expected
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        <fieldset>
          <Label>name</Label>
          <Input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <Label>description</Label>
          <Textarea
            required
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <Label>audience industry</Label>
          <Input
            required
            name="audience_industry"
            value={form.audience.industry}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <Label>audience location</Label>
          <Input
            required
            name="audience_location"
            value={form.audience.location}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <Label>audience income level</Label>
          <Input
            required
            name="audience_income_level"
            value={form.audience.income_level}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <Label>intro script</Label>
          <Textarea
            required
            name="intro_script"
            value={form.intro_script}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <div className="mb-2">
            <Label>objection: too expensive</Label>
            <p className="text-sm text-neutral-600">
              How should the AI reply when a customer says the price is too
              high?
            </p>
          </div>
          <Input
            required
            name="too_expensive"
            value={form.objections_and_responses.too_expensive}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <div className="mb-2">
            <Label>objection: not interested</Label>
            <p className="text-sm text-neutral-600">
              How should the AI reply when a customer is not interested?
            </p>
          </div>
          <Input
            required
            name="not_interested"
            value={form.objections_and_responses.not_interested}
            onChange={handleChange}
          />
        </fieldset>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating.." : "Create Agent"}
        </Button>
      </form>
    </main>
  );
}
