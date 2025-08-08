"use client";

import { DataTable } from "@/components/data-table";
import Loader from "@/components/loader";
import { ErrorText, H1 } from "@/components/typography";
import { contactColumns } from "@/lib/columns";
import { COOKIE_KEYS } from "@/lib/constants";
import { fetchContacts } from "@/lib/services/contacts";
import { APIResponse, Business, Contact } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function CustomersPage() {
  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  const { data, isFetching, error } = useQuery<APIResponse<Contact[]>>({
    queryKey: ["contacts", currentBusiness?.id],
    queryFn: () => fetchContacts(currentBusiness?.id as string),
    enabled: !!currentBusiness?.id,
  });

  if (error) return <ErrorText>{error.message}</ErrorText>;

  return (
    <div className="space-y-8">
      <H1>Customers</H1>
      <div>
        {isFetching ? (
          <Loader />
        ) : (
          <DataTable columns={contactColumns} data={data?.data || []} />
        )}
      </div>
    </div>
  );
}
