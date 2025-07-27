"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "../lib/constants";

const routes = [
  {
    label: "About",
    pathname: ROUTES.about,
  },
  {
    label: "Blog",
    pathname: ROUTES.blog,
  },
  {
    label: "Contact",
    pathname: ROUTES.contact,
  },
];

export default function Home() {
  return (
    <>
      <header className="h-[100px] px-5">
        <div className="h-full w-full items-center justify-between container mx-auto flex border-b border-neutral-200/50">
          <nav className="h-full hidden md:block">
            <ul className="flex items-center h-full gap-4">
              {routes.map((a) => (
                <li key={a.label}>
                  <Link href={a.pathname}>{a.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <Logo />
          <Link href={ROUTES.app.agents.index} className="hidden md:block">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <section className="items-center justify-center flex h-[calc(100vh-100px)] px-5">
        <div className="max-w-[800px] text-center space-y-10">
          <h1 className="text-2xl md:text-[3.5rem] leading-[1.2] bold-heading">
            Fire Your Sales Team. Hire a Voice Agent (It Works Weekends).
          </h1>
          <p className="text-neutral-600 leading-[1.7] md:text-xl">
            Why pay monthly huge salaries when you can deploy an AI Sales Agent
            in seconds for less than $50/mo? Let it cold call, follow up, and
            close deals while you&apos;re asleep (or on a beach). No leave/sick
            days. Just pure hustle, 24/7.
          </p>
          <Link href={ROUTES.app.agents.index} className="block w-max mx-auto">
            <Button size="lg">
              <Flame />
              Ship your first agent
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
