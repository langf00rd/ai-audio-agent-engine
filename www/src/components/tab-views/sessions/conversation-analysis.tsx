import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { useConversation } from "@/lib/services/mutations/conversation";
import { APIResponse, AnalyzedConversation } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";

export default function ConversationAnalytics(props: {
  query: UseQueryResult<APIResponse<AnalyzedConversation>, Error>;
  sessionId: string;
}) {
  const { analyzeConversationMutation } = useConversation();
  if (props.query.isFetching) return <Loader />;
  if (props.query.error) {
    return (
      <EmptyState
        title="Huh, this conversation has not been analyzed yet"
        isActionButtonDisabled={analyzeConversationMutation.isPending}
        onActionButtonClick={() =>
          analyzeConversationMutation.mutate(props.sessionId)
        }
        actionButtonLabel={
          analyzeConversationMutation.isPending
            ? "Analyzing..."
            : "Analyze conversation"
        }
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="font-semibold">Customer Information</h2>
        <div className="space-y-1">
          <p className="text-neutral-500">Name</p>
          <p>{props.query.data?.data.customer?.name || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Email</p>
          <p>{props.query.data?.data.customer?.email || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Phone</p>
          <p>{props.query.data?.data.customer?.phone || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Location</p>
          <p>{props.query.data?.data.customer?.location || "--"}</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="font-semibold">Interaction</h2>
        <div className="space-y-1">
          <p className="text-neutral-500">Intent</p>
          <Badge>{props.query.data?.data.intent || "--"}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Summary</p>
          <p>{props.query.data?.data.summary || "--"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Lead Quality</p>
          <Badge>{props.query.data?.data.lead_quality || "--"}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-500">Next step</p>
          <p>{props.query.data?.data.next_step}</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="font-semibold">Other Metadata</h2>
        <ul className="space-y-6">
          {Object.entries(props.query.data?.data.metadata || {}).map(
            ([key, value]) => (
              <li key={key}>
                <p className="text-neutral-500 capitalize">
                  {key.replaceAll("_", " ")}
                </p>
                <p className="capitalize">{String(value)}</p>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
