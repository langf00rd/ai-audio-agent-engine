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

export default function ConfigureAgent() {
  return (
    <form className="space-y-10">
      <h1 className="font-semibold text-xl">Configure your agent</h1>
      <fieldset className="space-y-2">
        <Label>Upload contact list</Label>
        <p className="text-sm text-neutral-600">
          The agent will reach out to the contacts you upload via the specified
          communication channel per the outreach frequency
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
  );
}
