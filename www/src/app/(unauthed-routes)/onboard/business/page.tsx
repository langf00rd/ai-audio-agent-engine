"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { createBusiness } from "@/lib/services/business";
import { User } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function CreateBusinessPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => {
      console.log("payload", payload);
      return createBusiness(payload);
    },
    onSuccess: (data) => {
      toast("business created");
      Cookie.set(COOKIE_KEYS.business, JSON.stringify([data.data]));
      Cookie.set(COOKIE_KEYS.currentBusiness, JSON.stringify(data.data));
      window.location.href = searchParams.get("redirect") || ROUTES.app.index;
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  function handleCreateBusiness(evt: FormEvent) {
    evt.preventDefault();
    const user = getCookie<User>(COOKIE_KEYS.user, { parse: true });
    if (!user) toast("please login to create a business");
    mutation.mutate({
      ...formData,
      user_id: user?.id,
      contact_info: {
        phone: formData.contact_info_phone,
        email: formData.contact_info_email,
      },
    });
  }

  const formStepToDisplay = FORM_STEPS.find((a) => a.step === step);

  function stepForward() {
    setStep((prev) => prev + 1);
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            type: "tween",
          }}
          className="space-y-1"
        >
          <span>
            <H1 className="text-center">{formStepToDisplay!.title}</H1>
          </span>
          <p className="text-center opacity-70">
            {formStepToDisplay!.description}
          </p>
        </motion.div>
      </div>
      <motion.form
        key={step}
        onSubmit={handleCreateBusiness}
        ref={formRef}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "tween",
          delay: 0.2,
        }}
      >
        {formStepToDisplay!.fields.map((field) => (
          <fieldset key={field.label}>
            <Label htmlFor={field.value}>{field.label}</Label>
            {field.inputType === "textarea" ? (
              <Textarea
                name={field.value}
                value={formData[field.value] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.value]: e.target.value,
                  }))
                }
              />
            ) : field.inputType === "select" ? (
              <Select
                name={field.value}
                value={formData[field.value] || ""}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, [field.value]: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {(field as { options: string[] }).options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                name={field.value}
                type={field.type || "text"}
                value={formData[field.value] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.value]: e.target.value,
                  }))
                }
              />
            )}
          </fieldset>
        ))}
        <div className="flex items-center justify-end">
          {step === FORM_STEPS.length - 1 ? (
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => formRef.current?.requestSubmit()}
            >
              {mutation.isPending ? "Creating..." : "Create My Business"}
            </Button>
          ) : (
            <Button type="button" onClick={stepForward}>
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </motion.form>
    </div>
  );
}

const FORM_STEPS = [
  {
    step: 0,
    title: "Company Identity",
    description: "Start by telling us the essentials about your business.",
    fields: [
      {
        label: "Name",
        value: "name",
        type: "text",
      },
      {
        label: "Slogan",
        value: "slogan",
        type: "text",
      },
      {
        label: "Industry",
        value: "industry",
        inputType: "select",
        options: ["Technology", "Retail", "Finance", "Healthcare", "Education"],
      },
    ],
  },
  {
    step: 1,
    title: "Business Details",
    description:
      "Help us understand what your company does and where to find you online.",
    fields: [
      {
        label: "Description",
        value: "description",
        type: "text",
        inputType: "textarea",
      },
      {
        label: "Website",
        value: "website",
        type: "url",
      },
    ],
  },
  {
    step: 2,
    title: "Contact Info",
    description: "How can we or your customers reach you?",
    fields: [
      {
        label: "Phone",
        value: "contact_info_phone",
        type: "tel",
      },
      {
        label: "Email",
        value: "contact_info_email",
        type: "email",
      },
    ],
  },
];
