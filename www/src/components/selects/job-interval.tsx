import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobIntervals = [
  { label: "2 hours", value: "2 hours" },
  { label: "12 hours", value: "12 hours" },
  { label: "24 hours", value: "24 hours" },
];

export function JobIntervalSelect(props: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select interval" />
      </SelectTrigger>
      <SelectContent>
        {jobIntervals.map((interval) => (
          <SelectItem key={interval.value} value={interval.value}>
            {interval.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
