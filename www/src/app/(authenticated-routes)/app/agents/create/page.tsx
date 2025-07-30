"use client";

import CreateAgentForm from "@/components/forms/create-agent";
import { ROUTES } from "@/lib/constants";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateAgentPage() {
  const router = useRouter();
  return (
    <main className="space-y-10">
      <div className="text-center space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold">
          Create an agent for your business
        </h1>
        <p>Start by provide basic information about this agent</p>
      </div>
      <motion.div
        initial={{
          y: -40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "tween",
        }}
      >
        <CreateAgentForm
          onSubmitError={(err) => alert(err)}
          onSubmitSuccess={(data) => {
            toast("agent created");
            router.push(`${ROUTES.agent.index}/${data.id}`);
          }}
        />
      </motion.div>
    </main>
  );
}
