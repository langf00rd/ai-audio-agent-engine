"use client";

import { AgentAnalyticsChart } from "@/components/charts/agent";
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
import {
  AgentAnalytics,
  AgentAnalyticsChartDuration,
  AgentAnalyticsMetadata,
  AgentConfig,
  Analytics,
} from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";
import { Code, Copy, Play, Settings2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentInfo() {
  const params = useParams();
  const [chartDayFilter, setChartDayFilter] =
    useState<AgentAnalyticsChartDuration>(AgentAnalyticsChartDuration.DAY);
  const [agent, setAgent] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [analyticsRaw, setAnalyticsRaw] = useState<
    Analytics<AgentAnalyticsMetadata>[] | null
  >(null);

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
          new Date(d.created_at).toLocaleString("en-US", { weekday: "long" }),
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
  }, [params.id]);

  const embedScript = `<script src="${process.env.NEXT_PUBLIC_SITE_URL}embed.js" data-agent-id="${params.id}"></script>`;

  if (loading) return <p className="text-center p-10">loading...</p>;

  if (!loading && !agent) return <p>No agent found</p>;

  return (
    <main className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold capitalize">
          Speak to {agent?.name || "..."}
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
              <DialogHeader>
                <DialogTitle>Embed this agent on your website</DialogTitle>
                <DialogDescription>
                  Let visitors chat with your AI agent anytime—ensuring customer
                  engagement continues, even when you&apos;re offline. Just add
                  the provided tag before the closing body tag of your website
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Textarea
                  readOnly
                  className="bg-neutral-100 h-[40px]"
                  value={embedScript}
                />
                <Button onClick={() => copyToClipboard(embedScript)}>
                  <Copy />
                </Button>
              </div>
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
        <li className="bg-neutral-50 rounded-[14px] p-4">
          <h3 className="text-neutral-600">Total Calls</h3>
          <p className="text-2xl font-semibold">
            {analytics?.totalInvocations || "--"}
          </p>
        </li>
        <li className="bg-neutral-50 rounded-[14px] p-4">
          <h3 className="text-neutral-600">Highest traffic day</h3>
          <p className="text-2xl font-semibold">
            {analytics?.mostCommonDay || "--"}
          </p>
        </li>
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
