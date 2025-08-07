import { ReactNode } from "react";

export default function SettingItem(props: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-[1.5] space-y-1">
        <h3 className="font-medium">{props.title}</h3>
        {props.description && <p className="opacity-60">{props.description}</p>}
      </div>
      <div className="flex-1 w-full flex justify-end">{props.children}</div>
    </div>
  );
}
