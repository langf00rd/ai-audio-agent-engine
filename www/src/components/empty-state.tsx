import { Button } from "@/components/ui/button";
export default function EmptyState(props: {
    title: string;
    actionButtonLabel: string;
    onActionButtonClick: () => void;
    isActionButtonDisabled?: boolean;
}) {
    return (
        <>
            <div className="flex items-center flex-col gap-4 py-20">
                <h2 className="font-medium">{props.title}</h2>
                <Button
                    onClick={props.onActionButtonClick}
                    disabled={props.isActionButtonDisabled}
                >
                    {props.actionButtonLabel}
                </Button>
            </div>
        </>
    );
}
