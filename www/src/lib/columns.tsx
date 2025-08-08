import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Session } from "./types";
import { getDurationString, isoToReadableDate } from "./utils";

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "start_dt",
    header: "Start Date",
    cell: ({ getValue }) => {
      return isoToReadableDate(getValue() as Date);
    },
  },
  {
    accessorKey: "end_dt",
    header: "End Date",
    cell: ({ getValue }) => {
      const date = getValue() as Date | null;
      return date ? isoToReadableDate(getValue() as Date) : "--";
    },
  },
  {
    id: "duration",
    accessorKey: "end_dt",
    header: "Duration",
    cell: ({ row }) => {
      const start = row.original.start_dt;
      const end = row.original.end_dt;
      if (!end) return "--";
      return getDurationString(start, end);
    },
  },
  {
    accessorKey: " ",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const end = row.original.end_dt;
      return (
        <Badge
          variant={end ? "success-outline" : "destructive-outline"}
          className="gap-2"
        >
          {end ? "Completed" : "Not Completed"}
        </Badge>
      );
    },
  },
];
