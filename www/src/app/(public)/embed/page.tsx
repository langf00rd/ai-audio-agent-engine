"use client";
import AgentChat from "@/components/agent-chat";
export default function EmbedPage() {
  const url = new URL(window.location.href);
  const agentId = url.searchParams.get("agent_id");
  if (!agentId) return <p>please pass a valid agent id</p>;
  return (
    <div className="h-screen w-screen p-10 max-w-[500px] mx-auto">
      <AgentChat id={agentId} isEmbed />
    </div>
  );
}
