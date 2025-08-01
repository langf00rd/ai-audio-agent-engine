"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Building, Check, Mail, PlusIcon, Search } from "lucide-react";
import Image from "next/image";
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
      <header className="h-[70px] px-5 sticky top-0">
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
      <section className="md:fixed flex-col md:w-screen items-center justify-center flex py-20 space-y-20 px-5">
        <div className="text-center space-y-10">
          <div className="space-y-1">
            <p className="opacity-55">
              /tuː/ • noun • Pronounced &ldquo;Two&rdquo;
            </p>
            <h1 className="text-[1.6rem] md:text-[2.8rem] w-full max-w-[600px] mx-auto leading-[1.2] bold-heading">
              Turn Website Visitors Into Paying Clients{" "}
              <span className="bold-heading italic opacity-70">
                Automatically
              </span>
            </h1>
          </div>
          <p className="text-neutral-600 max-w-[700px] mx-auto leading-[1.7] md:text-[20px]">
            Your Toow AI sales agent talks to visitors, captures leads, and
            follows up across WhatsApp, email, and SMS, so you can focus on
            closing deals, not chasing them
          </p>
          <div className="flex items-center flex-col md:flex-row justify-center gap-4">
            <Link
              href={ROUTES.app.agents.index}
              className="block md:w-max w-full max-w-[260px]"
            >
              <Button size="lg" className="w-full">
                <PlusIcon />
                Create your sales agent
              </Button>
            </Link>
            <Link
              href={ROUTES.demo}
              target="_blank"
              className="block md:w-max w-full max-w-[260px]"
            >
              <Button size="lg" className="w-full" variant="outline">
                See live demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="border border-neutral-100 hidden md:block rounded-[30px] bg-white/60 p-[10px]">
          <Image
            src="/dashboard.png"
            className="rounded-[20px] border border-neutral-100 shadow"
            alt="screenshot of toow ai sales agent analytics page"
            width={1000}
            height={1000}
          />
        </div>
      </section>
      <section className="md:relative px-5 md:min-h-screen flex flex-col gap-[100px] items-center justify-center md:top-[100vh] bg-primary text-white py-20">
        <h1 className="text-2xl max-w-xl text-center md:font-semibold md:text-[2.6rem]">
          All You Need to Run Your Business On{" "}
          <span className="bold-heading text-white! italic opacity-70">
            Autopilot
          </span>{" "}
          ...
        </h1>
        <ul className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-20">
          {[
            {
              title: "Captures and Qualifies Leads",
              icon: Search,
              description:
                "Auto-collects key customer data and prioritizes high-intent leads, so you focus only where it matters.",
            },
            {
              title: "Follows Up Like a Pro",
              icon: Mail,
              description:
                "Your AI agent doesn’t just say goodbye. It follows up with leads via their preferred channel until the deal is closed.",
            },
            {
              title: "Tailored to Your Business",
              icon: Building,
              description:
                "Fully customizable tone, services, FAQs, and pitch. Feels like your best salesperson, just digital.",
            },
            {
              title: "Works While You Grow",
              icon: Check,
              description:
                "Handle more customers without hiring more reps. Scale your outreach without scaling your payroll.",
            },
          ].map((a, index) => (
            <li
              key={index}
              className="space-y-3 flex flex-col items-center justify-center text-center"
            >
              <div className="bg-[wheat]/10 h-[70px] rounded-[20px] w-[70px] items-center justify-center flex">
                <a.icon size={30} />
              </div>
              <h3 className="font-medium text-xl md:text-[1.4rem]">
                {a.title}
              </h3>
              <p className="opacity-80 md:text-[18px]">{a.description}</p>
            </li>
          ))}
        </ul>
        <Link
          href={ROUTES.app.agents.index}
          className="block md:w-max w-full max-w-[260px]"
        >
          <Button variant="secondary" size="lg" className="w-full">
            <PlusIcon /> Create Your sales agent
          </Button>
        </Link>
      </section>
    </div>
  );
}
