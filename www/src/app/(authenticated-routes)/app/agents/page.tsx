"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { ErrorText } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { fetchAgents } from "@/lib/services/agent";
import { AgentConfig, APIResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Globe, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgentsPage() {
    const router = useRouter();

    const {
        data: agents,
        isFetching,
        error,
    } = useQuery<APIResponse<AgentConfig[]>>({
        queryKey: ["agents"],
        queryFn: fetchAgents,
    });

    if (error) return <ErrorText>{error.message}</ErrorText>;

    if (isFetching) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Your agents</h1>
                <Link href={ROUTES.agent.create}>
                    <Button>
                        <Plus />
                        Create agent
                    </Button>
                </Link>
            </div>
            {agents?.data.length === 0 ? (
                <EmptyState
                    actionButtonVariant="secondary"
                    title="No agents found"
                    actionButtonLabel="Create your first agent"
                    onActionButtonClick={() => {
                        router.push(ROUTES.agent.create);
                    }}
                />
            ) : (
                <ul className="space-y-2">
                    {agents?.data.map((agent, index) => (
                        <li key={agent.id}>
                            <Link
                                href={`${ROUTES.agent.index}/${agent.id}`}
                                className="block space-y-1 capitalize rounded-[25px] bg-white border border-neutral-100 shadow-xs cursor-pointer  hover:bg-neutral-100 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">
                                        {agent.name} •{" "}
                                        <span className="opacity-50">
                                            {agent.business_name}
                                        </span>
                                    </h2>
                                    {agent.is_public && (
                                        <Globe
                                            size={16}
                                            className="text-primary"
                                        />
                                    )}
                                </div>
                                <p className="opacity-70">
                                    {agent.description}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
