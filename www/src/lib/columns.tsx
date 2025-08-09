import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Contact, Session } from "./types";
import { getDurationString, getInitials, isoToReadableDate } from "./utils";

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
            <Badge key={m.id} variant="outline" className="w-fit">
              {m.type}: {m.value}
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
