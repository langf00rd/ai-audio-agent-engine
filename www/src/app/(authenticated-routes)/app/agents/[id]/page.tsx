"use client";

import { AgentAnalyticsChart } from "@/components/charts/agent";
import Loader from "@/components/loader";
import StatCard from "@/components/stat-card";
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
import { fetchAgentAnalytics, fetchAgentById } from "@/lib/services/agent";
import { fetchAgentSessionConversations } from "@/lib/services/conversations";
import {
  AgentAnalytics,
  AgentAnalyticsChartDuration,
  AgentAnalyticsMetadata,
  AgentConfig,
  Analytics,
  APIResponse,
  SessionConversation,
} from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Code, Copy, Play, Settings2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const [domain, setDomain] = useState<string | null>(null);
  const [chartDayFilter, setChartDayFilter] =
    useState<AgentAnalyticsChartDuration>(AgentAnalyticsChartDuration.DAY);
  const [agent, setAgent] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [analyticsRaw, setAnalyticsRaw] = useState<
    Analytics<AgentAnalyticsMetadata>[] | null
  >(null);

  const { data: sessionConversations } = useQuery<
    APIResponse<SessionConversation[]>
  >({
    queryKey: ["agent-session-conversations", params.id],
    queryFn: () => fetchAgentSessionConversations(String(params.id)),
    enabled: !!params.id,
  });

  useEffect(() => {
    async function handleFetchAgent() {
      try {
        setLoading(true);
        const { data } = await fetchAgentById(String(params.id));
        setAgent(data);
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }

    async function handleFetchAgentAnalytics() {
      try {
        setLoading(true);
        const { data } = await fetchAgentAnalytics(String(params.id));
        setAnalyticsRaw(data);
        const totalInvocations = data.length;
        const days = data.map((d) =>
          new Date(d.created_at).toLocaleString("en-US", {
            weekday: "long",
          }),
        );
        const dayCounts = days.reduce(
          (acc, day) => {
            acc[day] = (acc[day] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
        const mostCommonDay = Object.entries(dayCounts).reduce(
          (max, curr) => {
            return curr[1] > max[1] ? curr : max;
          },
          ["", 0],
        )[0];
        setAnalytics({ totalInvocations, mostCommonDay });
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }

    handleFetchAgent();
    handleFetchAgentAnalytics();
    setDomain(window.location.origin);
  }, [params.id]);

  const embedScript = `<script src="${domain}/embed.js" data-agent-id="${params.id}"></script>`;

  if (loading) return <Loader />;

  if (!loading && !agent) return <p>No agent found</p>;

  return (
    <main className="space-y-10">
      <BreadCrumbs id={String(params.id)} />
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold capitalize">
          {agent?.name || "..."}
        </h1>
        <div className="gap-x-2 flex items-center">
          <Link href={`${ROUTES.agent.index}/${params.id}/configure`}>
            <Button variant="secondary">
              <Settings2 />
              Settings
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Code />
                Get embed
              </Button>
            </DialogTrigger>
            <DialogContent>
              {agent?.is_public ? (
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
            href={`${ROUTES.agent.index}/${params.id}/play?agent_name=${agent?.name}`}
          >
            <Button>
              <Play />
              Talk to Agent
            </Button>
          </Link>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        <StatCard
          title="Conversation Sessions"
          value={Object.keys(sessionConversations?.data || {}).length}
          route={`/app/agents/${params.id}/sessions`}
        />
        <StatCard title="Total Calls" value={analytics?.totalInvocations} />
        <StatCard
          title="Highest traffic day"
          value={analytics?.mostCommonDay}
        />
        <StatCard title="General intent" value="Interested" />
        <StatCard title="Most inquired product/service" value="Interested" />
        <StatCard title="Average conversation duration" value="5mins 20secs" />
        <StatCard
          title="Most asked question"
          value="What is the lowest price of a purse?"
        />
      </ul>
      <div>
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
      </div>
    </main>
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
          <BreadcrumbPage>Your agent</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
