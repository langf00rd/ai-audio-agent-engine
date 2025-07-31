import { Agent } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAgent, updateAgent } from "../lib/services/agent";

export function useAgents() {
  const createAgentMutation = useMutation({
    mutationFn: (payload: Record<string, unknown> | Agent) => {
      return createAgent(payload);
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: (payload: Partial<Agent>) => {
      return updateAgent(payload);
    },
    onSuccess: () => {
      toast("agent updated");
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return { updateAgentMutation, createAgentMutation };
}
