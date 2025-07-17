"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Agent = {
  id: number;
  name: string;
  description: string;
  intro_script: string;
  audience: {
    industry: string;
    location: string;
    income_level: string;
  };
  objections_and_responses: Record<string, string>;
};

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

  if (loading) return <p className="text-center p-10">Loading agents...</p>;

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Sales AI Agents</h1>
      {agents.length === 0 && <p>No agents found.</p>}
      {agents.map((agent) => (
        <Link
          href={`/agents/${agent.id}`}
          key={agent.id}
          className="border block rounded-xl p-4 shadow-sm space-y-2"
        >
          <h2 className="text-lg font-bold">{agent.name}</h2>
          <p>{agent.description}</p>
          <p className="italic text-sm text-gray-500">{agent.intro_script}</p>

          <div className="text-sm">
            <p>
              <strong>Industry:</strong> {agent.audience.industry}
            </p>
            <p>
              <strong>Location:</strong> {agent.audience.location}
            </p>
            <p>
              <strong>Income Level:</strong> {agent.audience.income_level}
            </p>
          </div>

          <div className="text-sm mt-2">
            <strong>Objection Responses:</strong>
            <ul className="list-disc list-inside">
              {Object.entries(agent.objections_and_responses).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
