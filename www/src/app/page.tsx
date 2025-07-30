"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
    <div className="bg-[#fefdf6]">
      <header className="h-[70px] px-5">
        <div className="h-full w-full items-center justify-between container mx-auto flex">
          <Logo />
          <nav className="h-full hidden md:block">
            <ul className="flex items-center h-full gap-4">
              {routes.map((a) => (
                <li key={a.label}>
                  <Link
                    href={a.pathname}
                    className="uppercase font-semibold hover:underline text-sm"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href={ROUTES.app.agents.index} className="hidden md:block">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <section className="items-center justify-center flex h-[calc(100vh-70px)] px-5">
        <div className="text-center space-y-10">
          <h1 className="text-[1.6rem] md:text-[4rem] w-full max-w-[1000px] mx-auto leading-[1.2] bold-heading">
            Fire Your Sales Team. Hire a Voice Agent (It Works Weekends).
          </h1>
          <p className="text-neutral-600 max-w-[700px] mx-auto leading-[1.7] md:text-[20px]">
            Why pay monthly huge salaries when you can deploy an AI Sales Agent
            in seconds for less than $50/mo? Let it cold call, follow up, and
            close deals while you&apos;re asleep (or on a beach). No leave/sick
            days. Just pure hustle, 24/7.
          </p>
          <div className="flex items-center flex-col md:flex-row justify-center gap-4">
            <Link
              href={ROUTES.app.agents.index}
              className="block md:w-max w-full max-w-[260px]"
            >
              <Button className="w-full">
                <PlusIcon />
                deploy your first agent
              </Button>
            </Link>
            <Link
              href={ROUTES.demo}
              target="_blank"
              className="block md:w-max w-full max-w-[260px]"
            >
              <Button className="w-full" variant="outline">
                See live demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
