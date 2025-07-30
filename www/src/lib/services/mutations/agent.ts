import { Agent } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAgent, updateAgent } from "../agent";

export function useAgents() {
  const createAgentMutation = useMutation({
    mutationFn: (payload: Record<string, any>) => {
      return createAgent(payload);
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: (payload: Agent) => {
      return updateAgent(payload);
    },
    onSuccess: (data) => {
      toast("agent created");
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return { updateAgentMutation, createAgentMutation };
}
