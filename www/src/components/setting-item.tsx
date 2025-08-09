import { ReactNode } from "react";
import { Badge } from "./ui/badge";

export default function SettingItem(props: {
  title: string;
  description?: string;
  children?: ReactNode;
  isComingSoon?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-[1.2] space-y-1">
        <h3 className="font-medium flex gap-2">
          {props.title}
          {props.isComingSoon && <Badge className="scale-[0.8]">SOON</Badge>}
        </h3>
        {props.description && <p className="opacity-60">{props.description}</p>}
      </div>
      <div className="flex-1 w-full flex md:justify-end">{props.children}</div>
    </div>
  );
}
