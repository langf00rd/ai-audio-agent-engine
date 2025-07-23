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
