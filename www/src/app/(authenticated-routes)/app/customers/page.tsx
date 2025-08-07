"use client";

export default function CustomersPage() {
  // const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
  //   parse: true,
  // });

  // const {
  //   data: agents,
  //   isFetching,
  //   error,
  // } = useQuery<APIResponse<Agent[]>>({
  //   queryKey: ["agents", currentBusiness?.id],
  //   queryFn: () => fetchAgents(`business_id=${currentBusiness?.id}`),
  // });

  // const {
  //   data: agents,
  //   isFetching,
  //   error,
  // } = useQuery<APIResponse<Agent[]>>({
  //   queryKey: ["agents", currentBusiness?.id],
  //   queryFn: () => fetchAgentSessions(`business_id=${currentBusiness?.id}`),
  // });

  return (
    <div>
      <div>
        <h2 className="font-semibold text-xl">Customers</h2>
        <ul></ul>
      </div>
    </div>
  );
}
