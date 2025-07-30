import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { analyzeConversation } from "../conversations";

export function useConversation() {
  const analyzeConversationMutation = useMutation({
    mutationFn: (sessionId: string) => {
      return analyzeConversation(sessionId);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return { analyzeConversationMutation };
}
