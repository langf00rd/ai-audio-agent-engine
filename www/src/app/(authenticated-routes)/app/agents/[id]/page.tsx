"use client";

import EmptyState from "@/components/empty-state";
import Loader from "@/components/loader";
import StatCard from "@/components/stat-card";
import { H1 } from "@/components/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { fetchAgentSessions } from "@/lib/services/sessions";
import { Agent, APIResponse, Session } from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Code, Copy, Globe, Play, Settings2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const router = useRouter();
  const [domain, setDomain] = useState<string | null>(null);
  // const [chartDayFilter, setChartDayFilter] =
  //   useState<AgentAnalyticsChartDuration>(AgentAnalyticsChartDuration.DAY);

  const { data: sessions } = useQuery<APIResponse<Session[]>>({
    queryKey: ["agent-session", params.id],
    queryFn: () => fetchAgentSessions(String(params.id)),
    enabled: !!params.id,
  });

  const { data: agent, isFetching: isFetchingAgent } = useQuery<
    APIResponse<Agent>
  >({
    queryKey: ["agent-agent", params.id],
    queryFn: () => fetchAgentById(String(params.id)),
    enabled: !!params.id,
  });

  useEffect(() => {
    // async function handleFetchAgent() {
    //   try {
    //     setLoading(true);
    //     const { data } = await fetchAgentById(String(params.id));
    //     setAgent(data);
    //   } catch (err) {
    //     toast((err as Error).message);
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    // async function handleFetchAgentAnalytics() {
    //   try {
    //     setLoading(true);
    //     const { data } = await fetchAgentAnalytics(String(params.id));
    //     setAnalyticsRaw(data);
    //     const totalInvocations = data.length;
    //     const days = data.map((d) =>
    //       new Date(d.created_at).toLocaleString("en-US", {
    //         weekday: "long",
    //       }),
    //     );
    //     const dayCounts = days.reduce(
    //       (acc, day) => {
    //         acc[day] = (acc[day] || 0) + 1;
    //         return acc;
    //       },
    //       {} as Record<string, number>,
    //     );
    //     const mostCommonDay = Object.entries(dayCounts).reduce(
    //       (max, curr) => {
    //         return curr[1] > max[1] ? curr : max;
    //       },
    //       ["", 0],
    //     )[0];
    //     setAnalytics({ totalInvocations, mostCommonDay });
    //   } catch (err) {
    //     toast((err as Error).message);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // handleFetchAgentAnalytics();

    setDomain(window.location.origin);
  }, [params.id]);

  const embedScript = `<script async src="${domain}/embed.js" data-agent-id="${params.id}" type="text/javascript"></script>`;

  if (isFetchingAgent) return <Loader />;

  if (!isFetchingAgent && !agent)
    return (
      <EmptyState
        title="No agent found"
        actionButtonLabel="Create new agent"
        actionButtonVariant="secondary"
        onActionButtonClick={() => router.push(ROUTES.agent.create)}
      />
    );

  return (
    <main className="space-y-10">
      <BreadCrumbs agentName={agent?.data.name || ""} />
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold capitalize flex items-center gap-2">
          <H1>{agent?.data.name}</H1>
          {agent?.data.is_public && (
            <Globe size={16} className="text-primary" />
          )}
        </h1>
        <div className="gap-2 flex items-center flex-wrap">
          <Link href={`${ROUTES.agent.index}/${params.id}/configure`}>
            <Button variant="outline">
              <Settings2 />
              Settings
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Code />
                Embed on website
              </Button>
            </DialogTrigger>
            <DialogContent>
              {agent?.data.is_public ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Embed this agent on your website</DialogTitle>
                    <DialogDescription>
                      Let visitors chat with your AI agent anytime—ensuring
                      customer engagement continues, even when you&apos;re
                      offline. Just add the provided tag before the closing body
                      tag of your website
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      readOnly
                      className="bg-neutral-100"
                      value={embedScript}
                    />
                    <Button
                      className="w-fit"
                      variant="secondary"
                      onClick={() => copyToClipboard(embedScript)}
                    >
                      <Copy /> Copy code
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <p>
                    To enable this agent on a public website, you need to make
                    the agent public.
                  </p>
                  <div className="flex items-center gap-1 text-neutral-600 text-[14px]">
                    <p>Settings</p>
                    <ChevronRight size={12} />
                    <p>General</p>
                    <ChevronRight size={12} />
                    <p>Make agent public</p>
                  </div>
                  <Link href={`${ROUTES.agent.index}/${params.id}/configure`}>
                    <Button>Or click here</Button>
                  </Link>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Link
            href={`${ROUTES.agent.index}/${params.id}/play?agent_name=${agent?.data.name}`}
          >
            <Button>
              <Play />
              Talk to Agent
            </Button>
          </Link>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard
          title="Created Sessions"
          value={Object.keys(sessions?.data || {}).length}
          route={`/app/agents/${params.id}/sessions`}
        />
        {/*
        <StatCard title="Total Calls" value={analytics?.totalInvocations} />
        <StatCard
          title="Highest traffic day"
          value={analytics?.mostCommonDay}
        /> */}
        {/* <StatCard title="General intent" value="Interested" /> */}
        {/* <StatCard title="Most inquired product/service" value="Interested" /> */}
        {/* <StatCard
          title="Conversations duration"
          value={getTotalConversationDuration(sessions?.data || [])}
        /> */}
        {/* <StatCard
          title="Most asked question"
          value="What is the lowest price of a purse?"
        /> */}
      </ul>
      {/* <div>
        <div className="space-x-1 float-right">
          {Object.values(AgentAnalyticsChartDuration).map((a) => (
            <Button
              key={a}
              size="sm"
              onClick={() => setChartDayFilter(a)}
              variant={chartDayFilter === a ? "default" : "outline"}
            >
              {a}
            </Button>
          ))}
        </div>
        {analyticsRaw && (
          <AgentAnalyticsChart groupBy={chartDayFilter} data={analyticsRaw} />
        )}
      </div> */}
    </main>
  );
}

function BreadCrumbs(props: { agentName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={ROUTES.agent.index}>Agents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {props.agentName ? props.agentName : "Your agent"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
