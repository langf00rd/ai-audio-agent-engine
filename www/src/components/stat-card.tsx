import { formatNumber } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

export default function StatCard(props: {
  title: string;
  value: string | number | undefined;
  route?: string;
}) {
  return (
    <Link href={props.route || "#"} className="block">
      <Card className="h-[120px]">
        <CardContent className="flex flex-col justify-between h-full">
          <h3 className="text-neutral-600 capitalize">{props.title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-[16px] md:text-[20px] font-semibold capitalize">
              {typeof props.value === "number"
                ? formatNumber(Number(props.value))
                : props.value}
            </p>
            {props.route && (
              <p className="flex items-center text-sm gap-1 text-neutral-600">
                See all
                <ArrowUpRight className="text-neutral-400" size={18} />
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
