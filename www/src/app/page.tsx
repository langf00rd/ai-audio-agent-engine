"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
    return (
        <main className="h-screen w-screen px-10 md:px-0 flex items-center justify-center flex-col">
            <div className="max-w-[800px] text-center space-y-10">
                <h1 className="text-2xl md:text-[3.5rem] leading-[1.2] font-bold">
                    Fire Your Sales Team. Hire a Bot (It Works Weekends).
                </h1>
                <p className="text-neutral-600 leading-[1.7] md:text-xl">
                    Why pay monthly salaries when you can build a tireless AI
                    Sales Agent in seconds? Let it cold call, follow up, and
                    close deals — all while you&apos;re asleep (or on a beach).
                    No training. No sick days. Just pure hustle, 24/7.
                </p>
                <Link href={ROUTES.agent.index}>
                    <Button size="lg">Get started</Button>
                </Link>
            </div>
        </main>
    );
}
