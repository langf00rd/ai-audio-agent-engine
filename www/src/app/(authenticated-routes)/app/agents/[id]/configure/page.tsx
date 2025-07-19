"use client";

import CreateAgentForm from "@/components/forms/create-agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAgentById } from "@/lib/services/agent";
import { AgentConfig } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const tabs = ["General", "Knowledge base"];

export default function ConfigureAgent() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<AgentConfig | null>(null);

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
          <form className="space-y-10">
            <fieldset className="space-y-2">
              <Label>Upload contact list</Label>
              <p className="text-sm text-neutral-600">
                The agent will reach out to the contacts you upload via the
                specified communication channel per the outreach frequency
              </p>
              <Input type="file" name="contact_list" />
            </fieldset>
            <fieldset>
              <Label>Outreach Frequency</Label>
              <Select name="outreach_frequency">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {["hourly", "daily", "weekly", "monthly"].map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </fieldset>
            <Button>Save changes</Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
