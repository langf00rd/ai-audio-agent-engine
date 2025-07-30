"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { signIn } from "@/lib/services/auth";
import Cookie from "js-cookie";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ExternalToast, toast } from "sonner";

export default function SignInPage() {
    const searchParams = useSearchParams();
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
            window.location.href =
                searchParams.get("redirect") || ROUTES.agent.index;
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
            <h1 className="text-xl font-semibold mb-4">
                Login to your account
            </h1>
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
                    <Input
                        required
                        type="password"
                        placeholder="********"
                        name="password"
                    />
                </fieldset>
                <p className="text-sm text-neutral-700">
                    Don&apos;t have an account?{" "}
                    <Link href={ROUTES.auth.signUp} className="underline">
                        Create one
                    </Link>
                </p>
                <Button disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign in"}
                </Button>
            </form>
        </>
    );
}
