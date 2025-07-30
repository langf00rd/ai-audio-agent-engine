import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { PropsWithChildren } from "react";

export function ErrorText(props: PropsWithChildren) {
  return (
    <p className="text-destructive flex items-center justify-center gap-1 text-[14px]">
      <CircleAlert size={12} />
      {props.children}
    </p>
  );
}

export function H1(props: { children: string; className?: string }) {
  return (
    <h1
      className={cn(
        "md:text-[1.4rem] capitalize text-xl font-semibold",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}
