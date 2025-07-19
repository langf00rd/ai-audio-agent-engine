"use client";

import CreateAgentForm from "@/components/forms/create-agent";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function CreateAgentPage() {
  const router = useRouter();
  return (
    <CreateAgentForm
      onSubmitError={(err) => alert(err)}
      onSubmitSuccess={(data) => {
        alert("agent created");
        router.push(`${ROUTES.agent.index}/${data.id}`);
      }}
    />
  );
}
