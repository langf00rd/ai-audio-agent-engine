"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/lib/constants";
import { fetchAgentSessionConversations } from "@/lib/services/conversations";
import { APIResponse, SessionConversation } from "@/lib/types";
import { getDurationString, isoToReadableDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
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
      {isFetching ? (
        <Loader />
      ) : (
        <ul className="gap-3 flex flex-col-reverse">
          {sessionConversations?.data.map((a) => (
            <li key={a.session_id}>
              <Link
                href={`${ROUTES.agent.index}/${id}/sessions/${a.session_id}`}
                className="bg-white border border-neutral-100 shadow-xs hover:bg-neutral-100 transition-colors block space-y-4 p-4 rounded-[25px]"
              >
                <p className="font-medium line-clamp-2">
                  <span className="opacity-50">Customer</span>:{" "}
                  {a.messages[0].user}...{" "}
                  <span className="text-neutral-400">Agent</span>:{" "}
                  {a.messages[0].llm}
                </p>
                <div className="flex items-center gap-3 text-neutral-400 text-sm">
                  <p> {a.messages.length} Messages</p>
                  <p>{isoToReadableDate(a.start_dt)}</p>
                  <p>{getDurationString(a.start_dt, a.end_dt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
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
