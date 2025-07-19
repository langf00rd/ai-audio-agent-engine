"use client";

import { API_BASE_URL } from "@/lib/constants";
import { AgentConfig } from "@/lib/types";
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
      <h1 className="text-2xl font-semibold">Your agents</h1>
      {agents.length === 0 && <p>No agents found.</p>}
      <ul className="gap-4 grid grid-cols-2">
        {agents.map((agent) => (
          <li
            key={agent.id}
            className="rounded-md bg-neutral-100/70  hover:bg-neutral-100 p-6"
          >
            <Link href={`/agents/${agent.id}`} className="space-y-2 capitalize">
              <h2 className="text-xl font-semibold">{agent.name}</h2>
              <p>{agent.description}</p>
              <p className="text-sm text-neutral-400">{agent.brand_voice}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
