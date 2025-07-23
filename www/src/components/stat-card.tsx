export default function StatCard(props: {
    title: string;
    value: string | number | undefined;
}) {
    return (
        <div className="bg-neutral-50 rounded-[14px] p-4 space-y-1">
            <h3 className="text-neutral-600 text-[12px] capitalize md:text-[14px]">
                {props.title}
            </h3>
            <p className="text-[16px] font-semibold capitalize">
                {props.value || "--"}
            </p>
        </div>
    );
}
