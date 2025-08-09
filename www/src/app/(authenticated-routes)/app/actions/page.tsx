"use client";

import { DataTable } from "@/components/data-table";
import Loader from "@/components/loader";
import { ErrorText, H1 } from "@/components/typography";
import { jobsColumns } from "@/lib/columns";
import { COOKIE_KEYS } from "@/lib/constants";
import { fetchJobs } from "@/lib/services/jobs";
import { APIResponse, Business, Job } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function CustomersPage() {
  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data, isFetching, error } = useQuery<APIResponse<Job[]>>({
    queryKey: ["jobs", currentBusiness?.id],
    queryFn: () => fetchJobs(currentBusiness?.id as string),
    enabled: !!currentBusiness?.id,
  });

  if (error) return <ErrorText>{error.message}</ErrorText>;

  return (
    <div className="space-y-8">
      <H1>Agent Actions</H1>
      <div>
        {isFetching ? (
          <Loader />
        ) : (
          <DataTable columns={jobsColumns} data={data?.data || []} />
        )}
      </div>
    </div>
  );
}
