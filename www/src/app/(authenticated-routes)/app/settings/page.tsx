import EmptyState from "@/components/empty-state";
import { H1 } from "@/components/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <H1>Settings</H1>
      <Tabs defaultValue={TABS[0]} className="w-[400px]">
        <TabsList>
          {TABS.map((a) => (
            <TabsTrigger key={a} value={a}>
              {a}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TABS[0]}>
          <EmptyState title="Coming soon..." />
        </TabsContent>
        <TabsContent value={TABS[1]}>
          <EmptyState title="Coming soon..." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TABS = ["Your account", "Business"];
