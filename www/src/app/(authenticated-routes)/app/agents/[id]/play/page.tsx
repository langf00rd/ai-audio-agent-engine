"use client";

import AgentChat from "@/components/agent-chat";
import { useParams } from "next/navigation";

export default function AgentPlayPage() {
  const params = useParams();
  return (
    <div className="h-[90vh]">
      <AgentChat id={String(params.id)} />
    </div>
  );
}
