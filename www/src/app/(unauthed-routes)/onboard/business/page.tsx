"use client";

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
import useBusiness from "@/hooks/use-business";
import { BUSINESS_FORM_STEPS, COOKIE_KEYS } from "@/lib/constants";
import { User } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function CreateBusinessPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { createBusinessMutation } = useBusiness();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  function handleCreateBusiness(evt: FormEvent) {
    evt.preventDefault();
    const user = getCookie<User>(COOKIE_KEYS.user, { parse: true });
    if (!user) toast("please login to create a business");
    createBusinessMutation.mutate({
      ...formData,
      user_id: user?.id,
      contact_info: {
        phone: formData.contact_info_phone,
        email: formData.contact_info_email,
      },
    });
  }

  const formStepToDisplay = BUSINESS_FORM_STEPS.find((a) => a.step === step);

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
          className="space-y-2"
        >
          <span className="block">
            <h1 className="text-center font-medium text-2xl md:text-3xl">
              {formStepToDisplay!.title}
            </h1>
          </span>
          <p className="text-center text-xl opacity-70">
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
          {step === BUSINESS_FORM_STEPS.length - 1 ? (
            <Button
              type="button"
              disabled={createBusinessMutation.isPending}
              onClick={() => formRef.current?.requestSubmit()}
            >
              {createBusinessMutation.isPending
                ? "Creating..."
                : "Create My Business"}
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
