"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/services/auth";
import { FormEvent } from "react";

export default function SignUpPage() {
  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    try {
      const response = await signUp(email, password);
      console.log("response", response);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Create an account</h1>
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
        <Button>Sign up</Button>
      </form>
    </>
  );
}
