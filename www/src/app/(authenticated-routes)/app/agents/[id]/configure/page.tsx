"use client";

import EmptyState from "@/components/empty-state";
import CreateAgentForm from "@/components/forms/create-agent";
import Loader from "@/components/loader";
import SettingItem from "@/components/setting-item";
import { ErrorText } from "@/components/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgents } from "@/hooks/use-agent";
import { ROUTES } from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { Agent, APIResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = ["General", "Embedding", "Knowledge base"];

export default function ConfigureAgent() {
  const params = useParams();
  const { updateAgentMutation } = useAgents();
  const [agent, setAgent] = useState<Agent | null>(null);
  const { data, isFetching, error } = useQuery<APIResponse<Agent>>({
    queryKey: ["agent", params.id],
    queryFn: () => fetchAgentById(String(params.id)),
  });

  useEffect(() => {
    if (data?.data) setAgent(data?.data);
  }, [data?.data]);

  if (error) return <ErrorText>{error.message}</ErrorText>;

  return (
    <>
      <BreadCrumbs agentName={agent?.name || ""} agentId={agent?.id || ""} />
      <Tabs defaultValue={tabs[0]}>
        <TabsList>
          {tabs.map((a) => (
            <TabsTrigger value={a} key={a}>
              {a}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tabs[0]} className="max-w-[500px]">
          {isFetching && <Loader />}
          {agent && (
            <CreateAgentForm
              className="max-w-[500px]"
              data={{ ...agent, id: Number(params.id) }}
            />
          )}
        </TabsContent>
        <TabsContent value={tabs[1]}>
          <div className="space-y-8">
            <SettingItem
              title="Make agent public"
              description="Allow others to interact with this agent by embedding it on your website. Your agent will remain privat unless this is turned on."
            >
              <Switch
                id="airplane-mode"
                checked={agent?.is_public}
                onCheckedChange={(state) => {
                  if (!agent) return;
                  setAgent({
                    ...agent,
                    is_public: state,
                  });
                }}
              />
            </SettingItem>
            <Button
              disabled={isFetching}
              onClick={() =>
                updateAgentMutation.mutate(agent as Partial<Agent>)
              }
            >
              {isFetching ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value={tabs[2]} className="py-6">
          <EmptyState title="Coming soon..." />
        </TabsContent>
      </Tabs>
    </>
  );
}

function BreadCrumbs(props: { agentName: string; agentId: number | string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={ROUTES.agent.index}>Agents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`${ROUTES.agent.index}/${props.agentId}`}>
            {props.agentName || "Your Agent"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
