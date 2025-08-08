"use client";

import { DataTable } from "@/components/data-table";
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
import { sessionColumns } from "@/lib/columns";
import { ROUTES } from "@/lib/constants";
import { fetchAgentSessions } from "@/lib/services/sessions";
import { APIResponse, Session } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function AgentConversations() {
  const { id } = useParams();
  const router = useRouter();
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
        <DataTable
          columns={sessionColumns}
          data={sessions?.data || []}
          onRowClick={(a) =>
            router.push(`${ROUTES.agent.index}/${id}/sessions/${a.id}`)
          }
        />
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
