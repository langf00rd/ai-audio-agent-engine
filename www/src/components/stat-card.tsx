import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function StatCard(props: {
  title: string;
  value: string | number | undefined;
  route?: string;
}) {
  return (
    <Link href={props.route || "#"} className="block">
      <div className="bg-neutral-50 rounded-[14px] p-4 space-y-3">
        <h3 className="text-neutral-600 text-[12px] capitalize md:text-[14px]">
          {props.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-semibold capitalize">
            {props.value || "--"}
          </p>
          {props.route && (
            <p className="flex items-center text-sm text-neutral-600">
              See all
              <ChevronRight size={18} />
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
