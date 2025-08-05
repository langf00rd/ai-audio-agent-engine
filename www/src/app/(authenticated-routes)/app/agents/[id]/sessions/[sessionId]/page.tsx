"use client";

import { SessionConversationsBreadCrumbs } from "@/components/breadcrumbs";
import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchAnalyzedConversation,
  fetchSessionConversations,
} from "@/lib/services/conversations";
import { useConversation } from "@/lib/services/mutations/conversation";
import { AnalyzedConversation, APIResponse, Conversation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SessionDetailsPage() {
  const { id, sessionId } = useParams();
  const { data: conversations, isFetching } = useQuery<
    APIResponse<Conversation[]>
  >({
    queryKey: ["agent-conversations", sessionId],
    queryFn: () => fetchSessionConversations(String(sessionId)),
    enabled: !!sessionId,
  });
  return (
    <div className="space-y-8">
      <SessionConversationsBreadCrumbs id={String(id)} />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Tabs defaultValue="Analytics">
            <TabsList>
              {["Analytics", "Conversation"].map((a) => (
                <TabsTrigger key={a} value={a}>
                  {a}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Conversation" className="max-w-[500px]">
              <ul className="space-y-10">
                {conversations?.data.map((a) => (
                  <li key={a.id} className="space-y-4">
                    <div>
                      {a.user_input && <p className="text-neutral-500">User</p>}
                      <p className="text-xl leading-[1.6]">{a.user_input}</p>
                    </div>
                    <div>
                      {a.llm_response && (
                        <p className="text-neutral-500">Agent</p>
                      )}
                      <p className="text-xl leading-[1.6]">{a.llm_response}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="Analytics">
              <ConversationAnalytics sessionId={String(sessionId)} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function ConversationAnalytics(props: { sessionId: string }) {
  const { analyzeConversationMutation } = useConversation();

  const { data, isFetching, error } = useQuery<
    APIResponse<AnalyzedConversation>
  >({
    queryKey: ["analyzed-conversation", props.sessionId],
    queryFn: () => fetchAnalyzedConversation(String(props.sessionId)),
    enabled: !!props.sessionId,
  });

  // const [isLoading, setIsLoading] = useState(false);
  // async function handleTagConversation() {
  //   try {
  //     setIsLoading(true);
  //     await analyzeConversation(props.sessionId);
  //     window.location.reload();
  //   } catch (err) {
  //     toast((err as Error).message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  if (isFetching) return <Loader />;

  if (error) {
    return (
      <EmptyState
        title="Huh, this conversation has not been analyzed yet"
        isActionButtonDisabled={analyzeConversationMutation.isPending}
        actionButtonLabel={
          analyzeConversationMutation.isPending
            ? "Analyzing..."
            : "Analyze conversation"
        }
        onActionButtonClick={() =>
          analyzeConversationMutation.mutate(props.sessionId)
        }
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="font-semibold">Customer</h2>
        <div className="space-y-1">
          <p className="text-neutral-500">Name</p>
          <p>{data?.data.customer?.name || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Email</p>
          <p>{data?.data.customer?.email || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Phone</p>
          <p>{data?.data.customer?.email || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Location</p>
          <p>{data?.data.customer?.location || "--"}</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="font-semibold">Interaction</h2>
        <div className="space-y-1">
          <p className="text-neutral-500">Intent</p>
          <Badge>{data?.data.intent || "--"}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Summary</p>
          <p>{data?.data.summary || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Lead Quality</p>
          <Badge>{data?.data.lead_quality || "--"}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Next step</p>
          <p>{data?.data.next_step}</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="font-semibold">Other Metadata</h2>
        <ul className="space-y-6">
          {Object.entries(data?.data?.metadata || {}).map(([key, value]) => (
            <li key={key}>
              <p className="text-neutral-500 capitalize">
                {key.replaceAll("_", " ")}
              </p>
              <p className="capitalize">{String(value)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
