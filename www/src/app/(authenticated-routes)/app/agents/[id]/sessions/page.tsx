"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { H1 } from "@/components/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { fetchAgentSessionConversations } from "@/lib/services/conversations";
import { APIResponse, SessionConversation } from "@/lib/types";
import { getDurationString, isoToReadableDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Hourglass } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AgentConversations() {
  const { id } = useParams();
  const { data: sessionConversations, isFetching } = useQuery<
    APIResponse<SessionConversation[]>
  >({
    queryKey: ["agent-session-conversations", id],
    queryFn: () => fetchAgentSessionConversations(String(id)),
    enabled: !!id,
  });
  return (
    <div className="space-y-4">
      <BreadCrumbs id={String(id)} />
      <H1>Conversation Sessions</H1>
      {isFetching ? (
        <Loader />
      ) : (
        <div className="gap-3 grid md:grid-cols-2">
          {sessionConversations?.data.map((a) => (
            <Link href={`${ROUTES.agent.index}/${id}/sessions/${a.session_id}`}>
              <Card key={a.session_id} className="h-[120px]">
                <CardContent className="flex flex-col justify-between h-full">
                  <p className="font-medium line-clamp-2">
                    <span className="opacity-50">Customer</span>:{" "}
                    {a.messages[0].user}...{" "}
                    <span className="text-neutral-400">Agent</span>:{" "}
                    {a.messages[0].llm}
                  </p>
                  <div className="flex items-center gap-6 text-neutral-400 text-sm">
                    <p> {a.messages.length} Messages</p>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <p>{isoToReadableDate(a.start_dt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hourglass size={12} />
                      <p>{getDurationString(a.start_dt, a.end_dt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {Number(sessionConversations?.data.length) < 1 && (
        <EmptyState title="No conversations found" />
      )}
    </div>
  );
}

function BreadCrumbs(props: { id: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={ROUTES.agent.index}>Agents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`${ROUTES.agent.index}/${props.id}`}>
            Your agent
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Sessions</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
