"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { signIn } from "@/lib/services/auth";
import Cookie from "js-cookie";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    try {
      setIsLoading(true);
      const response = await signIn(email, password);
      Cookie.set(COOKIE_KEYS.token, response.data.token);
      Cookie.set(COOKIE_KEYS.user, JSON.stringify(response.data));
      window.location.href = ROUTES.agent.index;
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Login to your account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <fieldset>
          <Label>Email</Label>
          <Input
            required
            type="email"
            name="email"
            placeholder="john@acme.co"
          />
        </fieldset>
        <fieldset>
          <Label>Password</Label>
          <Input required type="password" name="password" />
        </fieldset>
        <Button disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in"}
        </Button>
      </form>
    </>
  );
}
