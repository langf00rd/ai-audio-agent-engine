"use client";

import CreateAgentForm from "@/components/forms/create-agent";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateAgentPage() {
  const router = useRouter();
  return (
    <CreateAgentForm
      onSubmitError={(err) => alert(err)}
      onSubmitSuccess={(data) => {
        toast("agent created");
        router.push(`${ROUTES.agent.index}/${data.id}`);
      }}
    />
  );
}
