"use client";

import { Agent } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/agents")
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
            className="border border-neutral-200 hover:bg-neutral-100 p-6"
          >
            <Link href={`/agents/${agent.id}`} className="space-y-2 capitalize">
              <h2 className="text-xl font-semibold">{agent.name}</h2>
              <p className="">{agent.description}</p>
              <div className="text-neutral-600">
                <h3 className="font-medium mb-1">Audience:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(agent.audience).map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">
                        {key.replaceAll("_", " ")}:
                      </span>{" "}
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
