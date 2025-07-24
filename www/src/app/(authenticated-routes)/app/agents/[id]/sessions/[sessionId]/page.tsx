"use client";

import Loader from "@/components/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/constants";
import { fetchAgentSessionConversations } from "@/lib/services/conversations";
import { APIResponse, SessionConversation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SessionDetailsPage() {
  const { id, sessionId } = useParams();
  const { data: sessionConversations, isFetching } = useQuery<
    APIResponse<SessionConversation[]>
  >({
    queryKey: ["agent-session-conversations", id],
    queryFn: () => fetchAgentSessionConversations(String(id)),
    enabled: !!id,
  });
  return (
    <div className="space-y-8">
      <BreadCrumbs id={String(id)} />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Tabs defaultValue="Conversation">
            <TabsList>
              {["Conversation", "Analytics"].map((a) => (
                <TabsTrigger key={a} value={a}>
                  {a}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Conversation">
              <ul className="space-y-10">
                {sessionConversations?.data
                  .find((a) => a.session_id === sessionId)
                  ?.messages.map((a) => (
                    <li key={a.id} className="space-y-4">
                      <div>
                        {a.user && <p className="text-neutral-500">User</p>}
                        <p className="text-xl leading-[1.6]">{a.user}</p>
                      </div>
                      <div>
                        {a.llm && <p className="text-neutral-500">Agent</p>}
                        <p className="text-xl leading-[1.6]">{a.llm}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </TabsContent>
            <TabsContent value="Analytics">
              Change your password here.
            </TabsContent>
          </Tabs>
        </>
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
          <BreadcrumbLink href={`${ROUTES.agent.index}/${props.id}/sessions`}>
            Sessions
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
