"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { signIn, signUp } from "@/lib/services/auth";
import Cookie from "js-cookie";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ExternalToast, toast } from "sonner";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(evt: FormEvent) {
        evt.preventDefault();
        const formData = new FormData(evt.target as HTMLFormElement);
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));
        const firstName = String(formData.get("first_name"));
        const lastName = String(formData.get("last_name"));
        try {
            await signUp(email, password, firstName, lastName);
            setIsLoading(true);
            const response = await signIn(email, password);
            console.log("signin response", response.data);
            Cookie.set(COOKIE_KEYS.token, response.data.token);
            Cookie.set(COOKIE_KEYS.user, JSON.stringify(response.data));
            window.location.href = ROUTES.agent.index;
        } catch (err) {
            toast((err as Error).message, {
                type: "error",
            } as unknown as ExternalToast);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1 className="text-xl font-semibold mb-4">Create an account</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                    <fieldset>
                        <Label>First Name</Label>
                        <Input required name="first_name" placeholder="John" />
                    </fieldset>
                    <fieldset>
                        <Label>Last Name</Label>
                        <Input required name="last_name" placeholder="Doe" />
                    </fieldset>
                </div>
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
                    <Input
                        required
                        type="password"
                        placeholder="********"
                        name="password"
                    />
                </fieldset>
                <p className="text-sm text-neutral-700">
                    Already have an account?{" "}
                    <Link href={ROUTES.auth.signIn} className="underline">
                        Sign in
                    </Link>
                </p>
                <Button disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign up"}
                </Button>
            </form>
        </>
    );
}
