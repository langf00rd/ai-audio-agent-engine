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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { fetchAgentSessions } from "@/lib/services/sessions";
import { APIResponse, Session } from "@/lib/types";
import { getDurationString, isoToReadableDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Hourglass } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AgentConversations() {
  const { id } = useParams();
  const { data: sessions, isFetching } = useQuery<APIResponse<Session[]>>({
    queryKey: ["agent-sessions", id],
    queryFn: () => fetchAgentSessions(String(id)),
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
          {sessions?.data.map((a, index) => (
            <Link
              key={index}
              href={`${ROUTES.agent.index}/${id}/sessions/${a.id}`}
            >
              <Card key={a.id} className="h-[120px]">
                <CardContent className="flex flex-col justify-between h-full">
                  <CardTitle className="font-semibold text-md">
                    {isoToReadableDate(a.start_dt)}
                  </CardTitle>
                  {a.end_dt ? (
                    <div className="flex items-center gap-1">
                      <Hourglass size={12} />
                      <p>{getDurationString(a.start_dt, a.end_dt)}</p>
                    </div>
                  ) : (
                    <>0 secs</>
                  )}
                  {/* <p className="font-medium line-clamp-2">
                    <span className="opacity-50">Customer</span>:{" "}
                    {a.messages[0].user}...{" "}
                    <span className="text-neutral-400">Agent</span>:{" "}
                    {a.messages[0].llm}
                  </p> */}
                  {/* <div className="flex items-center gap-6 text-neutral-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <p>{isoToReadableDate(a.start_dt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hourglass size={12} />
                      <p>{getDurationString(a.start_dt, a.end_dt)}</p>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {Number(sessions?.data.length) < 1 && (
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
