import { Button } from "@/components/ui/button";
export default function EmptyState(props: {
  title: string;
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  isActionButtonDisabled?: boolean;
  actionButtonVariant?: "secondary" | "outline";
}) {
  return (
    <>
      <div className="flex items-center flex-col gap-4 py-20">
        <h2 className="font-medium text-primary">{props.title}</h2>
        {props.actionButtonLabel && props.onActionButtonClick && (
          <Button
            variant={props.actionButtonVariant || "default"}
            onClick={props.onActionButtonClick}
            disabled={props.isActionButtonDisabled}
          >
            {props.actionButtonLabel}
          </Button>
        )}
      </div>
    </>
  );
}
