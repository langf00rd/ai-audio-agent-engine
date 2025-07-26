"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, ROUTES } from "@/lib/constants";
import { AgentConfig } from "@/lib/types";
import { Globe, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentsPage() {
  const router = useRouter();
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

  if (loading) return <Loader />;

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
      {agents.length === 0 ? (
        <EmptyState
          actionButtonVariant="secondary"
          title="No agents found"
          actionButtonLabel="Create your first agent"
          onActionButtonClick={() => {
            router.push(ROUTES.agent.create);
          }}
        />
      ) : (
        <ul className="space-y-2">
          {agents.map((agent, index) => (
            <li key={agent.id}>
              <Link
                href={`${ROUTES.agent.index}/${agent.id}`}
                className="block space-y-1 capitalize rounded-[14px] bg-white border border-neutral-100 shadow-xs cursor-pointer  hover:bg-neutral-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">
                    {agent.name} •{" "}
                    <span className="text-neutral-500">
                      {agent.business_name}
                    </span>
                  </h2>
                  {agent.is_public && (
                    <Globe size={16} className="text-primary" />
                  )}
                </div>
                <p className="text-neutral-600">{agent.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
