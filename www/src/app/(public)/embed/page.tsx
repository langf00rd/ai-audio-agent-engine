"use client";

import AgentChat from "@/components/agent-chat";
import { useEffect, useState } from "react";

export default function EmbedPage() {
  const [isGettingAgentId, setIsGettingAgentId] = useState(true);
  const [agentId, setAgentId] = useState<null | string>(null);

  useEffect(() => {
    setIsGettingAgentId(true);
    const url = new URL(window.location.href);
    const _agentId = url.searchParams.get("agent_id");
    if (_agentId) setAgentId(_agentId);
    setIsGettingAgentId(false);
  }, []);

  return (
    <div className="h-screen w-screen p-10 max-w-[500px] mx-auto">
      {isGettingAgentId && <p>please wait</p>}
      {!isGettingAgentId && !agentId && <p>please pass a valid agent id</p>}
      {agentId && <AgentChat id={agentId} isEmbed />}
    </div>
  );
}
