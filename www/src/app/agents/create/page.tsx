"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [form, setForm] = useState(form_empty_state);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const res = await fetch("http://localhost:8000/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);
    alert("agent created");
    setForm(form_empty_state);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[500px] mx-auto p-10 space-y-10"
    >
      <fieldset className="space-y-1">
        <Label>name</Label>
        <Input name="name" value={form.name} onChange={handleChange} />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>description</Label>
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>audience industry</Label>
        <Input
          name="audience_industry"
          value={form.audience.industry}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>audience location</Label>
        <Input
          name="audience_location"
          value={form.audience.location}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>audience income level</Label>
        <Input
          name="audience_income_level"
          value={form.audience.income_level}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>intro script</Label>
        <Input
          name="intro_script"
          value={form.intro_script}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>objection: too_expensive</Label>
        <Input
          name="too_expensive"
          value={form.objections_and_responses.too_expensive}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <Label>objection: not_interested</Label>
        <Input
          name="not_interested"
          value={form.objections_and_responses.not_interested}
          onChange={handleChange}
        />
      </fieldset>

      <Button type="submit">Create Agent</Button>
    </form>
  );
}
