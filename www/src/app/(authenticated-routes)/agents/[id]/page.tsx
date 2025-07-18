"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { Agent } from "@/lib/types";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleFetchAgent() {
      try {
        setLoading(true);
        const { data } = await fetchAgentById(String(params.id));
        setAgent(data);
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
    handleFetchAgent();
  }, [params.id]);

  if (loading) return <p className="text-center p-10">loading...</p>;

  if (!loading && !agent) return <p>No agent found</p>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold capitalize">
        Speak to {agent?.name || "..."}
      </h1>
      <div className="space-x-2">
        <Link href={`${ROUTES.agent.index}/${params.id}/configure`}>
          <Button variant="secondary">
            Configure Agent
            <Settings />
          </Button>
        </Link>
        <Link
          href={`${ROUTES.agent.index}/${params.id}/play?agent_name=${agent?.name}`}
        >
          <Button>Use Agent</Button>
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        <li className="border p-4">
          <h3 className="text-neutral-600">Invokations</h3>
          <p className="text-2xl font-semibold">100K+</p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Highest concurrent connections</h3>
          <p className="text-2xl font-semibold">73M</p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Highest concurrent connections</h3>
          <p className="text-2xl font-semibold">73M</p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Highest traffic day</h3>
          <p className="text-2xl font-semibold">Tuesday</p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Top audience location</h3>
          <p className="text-2xl font-semibold">Accra</p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Popular industry</h3>
          <p className="text-2xl font-semibold">Healthcare</p>
        </li>
      </ul>
    </main>
  );
}
