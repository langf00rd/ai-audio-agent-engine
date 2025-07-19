"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { fetchAgentAnalytics, fetchAgentById } from "@/lib/services/agent";
import { AgentAnalytics, AgentConfig } from "@/lib/types";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const [agent, setAgent] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);

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
    async function handleFetchAgentAnalytics() {
      try {
        setLoading(true);
        const { data } = await fetchAgentAnalytics(String(params.id));
        const totalInvocations = data.length;
        const days = data.map((d) =>
          new Date(d.created_at).toLocaleString("en-US", { weekday: "long" }),
        );
        const dayCounts = days.reduce(
          (acc, day) => {
            acc[day] = (acc[day] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
        const mostCommonDay = Object.entries(dayCounts).reduce(
          (max, curr) => {
            return curr[1] > max[1] ? curr : max;
          },
          ["", 0],
        )[0];
        setAnalytics({ totalInvocations, mostCommonDay });
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
    handleFetchAgent();
    handleFetchAgentAnalytics();
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
          <h3 className="text-neutral-600">Total Invokations</h3>
          <p className="text-2xl font-semibold">
            {analytics?.totalInvocations || "--"}
          </p>
        </li>
        <li className="border p-4">
          <h3 className="text-neutral-600">Highest traffic day</h3>
          <p className="text-2xl font-semibold">
            {analytics?.mostCommonDay || "--"}
          </p>
        </li>
      </ul>
    </main>
  );
}
