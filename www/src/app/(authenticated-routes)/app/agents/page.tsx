"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { ErrorText, H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { fetchAgents } from "@/lib/services/agent";
import { Agent, APIResponse, Business } from "@/lib/types";
import { getCookie, isoToReadableDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Globe, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgentsPage() {
  const router = useRouter();
  const business = getCookie<Business[]>(COOKIE_KEYS.business, {
    parse: true,
  }) || [
    {
      id: null,
    },
  ];

  const {
    data: agents,
    isFetching,
    error,
  } = useQuery<APIResponse<Agent[]>>({
    queryKey: ["agents", business[0].id],
    queryFn: () => fetchAgents(`business_id=${business[0].id}`),
  });

  if (error) return <ErrorText>{error.message}</ErrorText>;

  if (isFetching) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H1>Your agents</H1>
        <Link href={ROUTES.agent.create}>
          <Button>
            <Plus />
            Create agent
          </Button>
        </Link>
      </div>
      <Input icon={<Search size={18} />} placeholder="Search for agent..." />
      {agents?.data.length === 0 ? (
        <EmptyState
          actionButtonVariant="outline"
          title="That's sad, you have no agents"
          actionButtonLabel="Create your first agent"
          onActionButtonClick={() => {
            router.push(ROUTES.agent.create);
          }}
        />
      ) : (
        <div className="space-y-2 grid md:grid-cols-2 gap-2">
          {agents?.data.map((agent, index) => (
            <Link
              key={index}
              key-={index}
              href={`${ROUTES.agent.index}/${agent.id}`}
            >
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-[18px]">
                      {agent.name}
                    </CardTitle>
                    {agent.is_public && (
                      <Globe size={16} className="text-primary" />
                    )}
                  </div>
                  <p className="opacity-70 capitalize">{agent.description}</p>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="opacity-30" />
                    <p className="opacity-70">
                      {isoToReadableDate(agent.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
