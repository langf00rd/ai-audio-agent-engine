import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";
import { Contact, Job, Session } from "./types";
import {
  formatJobInterval,
  getDurationString,
  getInitials,
  isoToReadableDate,
} from "./utils";

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "start_dt",
    header: "Date",
    cell: ({ getValue }) => {
      return isoToReadableDate(getValue() as Date);
    },
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const start = row.original.start_dt;
      const end = row.original.end_dt;
      if (!end) return "--";
      return getDurationString(start, end);
    },
  },
  {
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

export const contactColumns: ColumnDef<Contact>[] = [
  {
    id: "name",
    header: "Full Name",
    cell: ({ row }) => {
      const fullName = `${row.original.first_name} ${row.original.last_name || ""}`;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <p>{fullName}</p>
        </div>
      );
    },
  },
  {
    id: "methods",
    header: "Contact Methods",
    cell: ({ row }) => {
      const methods = row.original.contact_methods;
      if (!methods || methods.length === 0) return "--";
      return (
        <div className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <Badge key={m.id} variant="outline" className="w-fit py-1">
              {m.type === "EMAIL" ? <Mail /> : <Phone />} {m.value}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => isoToReadableDate(getValue() as Date),
  },
];

export const jobsColumns: ColumnDef<Job>[] = [
  // {
  //   accessorKey: "id",
  //   header: "Job ID",
  //   cell: (info) => <code>{info.getValue()}</code>,
  // },
  // {
  //   accessorKey: "instruction",
  //   header: "Instruction",
  //   cell: (info) => (
  //     <div style={{ maxWidth: 250, whiteSpace: "normal" }}>
  //       {info.getValue()}
  //     </div>
  //   ),
  // },

  {
    accessorKey: "contact_segment_name",
    header: "Contact Segment",
    cell: (info) => info.getValue() || "None",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "interval",
    header: "Interval",
    cell: (info) => (
      <p>Every {formatJobInterval(info.getValue() as Job["interval"])}</p>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: (info) => isoToReadableDate(info.getValue() as Date),
  },
  {
    accessorKey: "last_run_at",
    header: "Last Run",
    cell: (info) => isoToReadableDate(info.getValue() as Date),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      return <Badge>{info.getValue() as string}</Badge>;
    },
  },
];
