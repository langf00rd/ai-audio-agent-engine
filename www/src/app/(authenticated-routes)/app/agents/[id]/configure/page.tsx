"use client";

import EmptyState from "@/components/empty-state";
import CreateAgentForm from "@/components/forms/create-agent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAgentById, updateAgent } from "@/lib/services/agent";
import { AgentConfig } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const tabs = ["General", "Sharing & Embedding", "Knowledge base"];

export default function ConfigureAgent() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<AgentConfig | null>(null);

  async function handleUpdateAgent() {
    if (!agent) return toast("no agent to update");
    try {
      setLoading(true);
      await updateAgent(agent as AgentConfig);
      toast("agent updated");
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

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
    handleFetchAgent();
  }, [params.id]);

  return (
    <>
      <Tabs defaultValue={tabs[0]}>
        <TabsList>
          {tabs.map((a) => (
            <TabsTrigger value={a} key={a}>
              {a}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tabs[0]} className="py-6">
          {loading && "loading..."}
          {agent && (
            <CreateAgentForm
              onSubmitSuccess={() => toast("agent updated successfully")}
              data={{ ...agent, id: Number(params.id) }}
            />
          )}
        </TabsContent>
        <TabsContent value={tabs[1]} className="py-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-[3] space-y-1">
                <h3 className="font-medium">Make agent public</h3>
                <p className="text-sm text-neutral-500">
                  Allow others to interact with this agent by embedding it on
                  your website. Your agent will remain privat unless this is
                  turned on.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-end">
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
              </div>
            </div>
            <Button onClick={handleUpdateAgent} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
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
