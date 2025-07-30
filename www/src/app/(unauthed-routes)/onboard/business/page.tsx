"use client";

import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { createBusiness } from "@/lib/services/business";
import { User } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Cookie from "js-cookie";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function CreateBusinessPage() {
  const mutation = useMutation({
    mutationFn: (payload: Record<string, any>) => {
      return createBusiness(payload);
    },
    onSuccess: (data) => {
      console.log("success", data);
      toast("business created");
      Cookie.set(COOKIE_KEYS.business, JSON.stringify(data.data));
      window.location.href = ROUTES.app.index;
    },
    onError: (err) => {
      toast(err);
    },
  });

  function handleSignIn(evt: FormEvent) {
    evt.preventDefault();
    const user = getCookie<User>(COOKIE_KEYS.user, { parse: true });
    const formData = new FormData(evt.target as HTMLFormElement);
    const formFields = Object.fromEntries(formData.entries());
    mutation.mutate({
      ...formFields,
      user_id: user?.id,
      contact_info: {
        phone: formFields.contact_info_phone,
        email: formFields.contact_info_email,
      },
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <H1 className="text-center">Let's setup your business</H1>
        <p className="text-center opacity-70">
          Your agents will also need this information to know how to communicate
          with your customers
        </p>
      </div>
      <form onSubmit={handleSignIn}>
        <fieldset>
          <Label>Name</Label>
          <Input name="name" placeholder="Acme Company" required />
        </fieldset>
        <fieldset>
          <Label>Slogan</Label>
          <Input name="slogan" placeholder="For the love of the game" />
        </fieldset>
        <fieldset>
          <Label>Description</Label>
          <Textarea name="description" />
        </fieldset>
        <fieldset>
          <Label>Industry</Label>
          <Input name="industry" placeholder="For the love of the game" />
        </fieldset>
        <fieldset>
          <Label>Website</Label>
          <Input name="website" placeholder="www.acme.co" />
        </fieldset>
        <fieldset>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="contact_info_phone"
            placeholder="+1233456789"
          />
        </fieldset>
        <fieldset>
          <Label>Email</Label>
          <Input
            name="contact_info_email"
            type="email"
            placeholder="hi@acme.co"
          />
        </fieldset>
        <Button disabled={mutation.isPending}>Continue</Button>
      </form>
    </div>
  );
}
