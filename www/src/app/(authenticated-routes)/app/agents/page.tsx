"use client";

import { Button } from "@/components/ui/button";
import { API_BASE_URL, ROUTES } from "@/lib/constants";
import { AgentConfig } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/agents`)
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch agents:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-10">loading agents...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your agents</h1>
        <Link href={ROUTES.agent.create}>
          <Button>
            <Plus />
            Create agent
          </Button>
        </Link>
      </div>
      {agents.length === 0 && <p>no agents found</p>}
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li
            key={agent.id}
            className="rounded-[14px] bg-neutral-50  hover:bg-neutral-100 p-4"
          >
            <Link
              href={`${ROUTES.agent.index}/${agent.id}`}
              className="space-y-1 capitalize"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{agent.name}</h2>
                <p className="text-sm text-neutral-400">{agent.brand_voice}</p>
              </div>
              <p className="text-neutral-600">{agent.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
