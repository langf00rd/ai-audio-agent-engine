"use client";

import Transcriber from "@/component/transcriber";
import { Agent } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/agents/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAgent(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch agents:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-10">loading...</p>;

  return (
    <main className="max-w-[500px] space-y-4 mx-auto p-10">
      <h1 className="text-2xl font-semibold capitalize">
        Speak to {agent?.name || "..."}
      </h1>
      <Transcriber />
    </main>
  );
}
