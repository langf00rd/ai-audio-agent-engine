"use client";

import { SessionConversationsBreadCrumbs } from "@/components/breadcrumbs";
import Loader from "@/components/loader";
import { JobIntervalSelect } from "@/components/selects/job-interval";
import SettingItem from "@/components/setting-item";
import ConversationAnalytics from "@/components/tab-views/sessions/conversation-analysis";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COOKIE_KEYS } from "@/lib/constants";
import {
  addContactToSegment,
  createContactSegment,
  fetchContactMethod,
} from "@/lib/services/contacts";
import {
  fetchAnalyzedConversation,
  fetchSessionConversations,
} from "@/lib/services/conversations";
import { createJob } from "@/lib/services/jobs";
import {
  AnalyzedConversation,
  APIResponse,
  Business,
  Conversation,
} from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SessionDetailsPage() {
  const { id, sessionId } = useParams();

  const [interval, setInterval] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);

  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data: conversations, isFetching } = useQuery<
    APIResponse<Conversation[]>
  >({
    queryKey: ["agent-conversations", sessionId],
    queryFn: () => fetchSessionConversations(String(sessionId)),
    enabled: !!sessionId,
  });

  const analyzedConversationQuery = useQuery<APIResponse<AnalyzedConversation>>(
    {
      queryKey: ["analyzed-conversation", sessionId],
      queryFn: () => fetchAnalyzedConversation(String(sessionId)),
      enabled: !!sessionId,
    },
  );

  const tabs = analyzedConversationQuery.data?.data
    ? ["Analytics", "Conversation", "Actions"]
    : ["Analytics", "Conversation"];

  async function handleStartJob() {
    try {
      setCreatingJob(true);

      const contact = await fetchContactMethod(
        analyzedConversationQuery.data?.data.customer?.email || "",
      );

      console.log("contact", contact);

      /**
       * 1. create customer segment (contact_segment_id) //
       * 2. add contact to segment (contact_segment_id) //
       * 3. create job (contact_segment_id, agent_id, business_id)
       */

      const contactSegment = await createContactSegment(
        currentBusiness?.id as string,
        Date.now().toString(),
      );

      console.log("contactSegment", contactSegment);

      const segmentContact = await addContactToSegment(contactSegment.data.id, [
        contact.data.contact_id,
      ]);

      console.log("segmentContact", segmentContact);

      const job = await createJob({
        instruction: "follow-up on this conversation",
        business_id: currentBusiness?.id,
        agent_id: id,
        contact_segment_id: contactSegment.data.id,
        type: "EMAIL",
        interval,
        start_dt: new Date().toISOString(),
        context: {
          sessionId,
        },
      });

      console.log("job", job);

      toast("job successfully created");
    } catch (err) {
      alert(err);
    } finally {
      setCreatingJob(false);
    }
  }

  return (
    <div className="space-y-8">
      <SessionConversationsBreadCrumbs id={String(id)} />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Tabs defaultValue="Analytics">
            <TabsList>
              {tabs.map((a) => (
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
              <ConversationAnalytics
                sessionId={sessionId as string}
                query={analyzedConversationQuery}
              />
            </TabsContent>
            <TabsContent value="Actions">
              {analyzedConversationQuery.data?.data && (
                <SettingItem
                  title="Allow agent to follow-up with customer"
                  description="This permission enables the agent to communicate directly with customers using their provided email addresses or phone numbers. Messages will be sent on your behalf, ensuring consistent outreach"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Allow</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start Automated Follow-Up Job</DialogTitle>
                        <DialogDescription>
                          You’re about to launch a follow-up job that lets your
                          agent communicate with the customer. Confirm to begin
                          the automated follow-up
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-1">
                        <p>
                          Email:{" "}
                          <span className="opacity-50">
                            {
                              analyzedConversationQuery.data.data.customer
                                ?.email
                            }
                          </span>
                        </p>
                        <p>
                          Phone:{" "}
                          <span className="opacity-50">
                            {
                              analyzedConversationQuery.data.data.customer
                                ?.phone
                            }
                          </span>
                        </p>
                      </div>
                      <span className="flex items-center gap-2">
                        <p>Every</p>{" "}
                        <JobIntervalSelect onChange={setInterval} />
                      </span>
                      <DialogFooter>
                        <Button
                          onClick={handleStartJob}
                          isLoading={creatingJob}
                        >
                          Start job
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SettingItem>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
