"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { Business } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import Cookie from "js-cookie";

export default function WorkspaceSwitcher() {
  const businesses = getCookie<Business[]>(COOKIE_KEYS.business, {
    parse: true,
  });

  const currentBusiness = getCookie<Business>(COOKIE_KEYS.currentBusiness, {
    parse: true,
  });

  function handleChangeWorkspace(businessId: string) {
    const business = businesses?.find((a) => a.id === businessId);
    Cookie.set(COOKIE_KEYS.currentBusiness, JSON.stringify(business));
    window.location.href = ROUTES.app.index;
  }

  return (
    <Select onValueChange={handleChangeWorkspace}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentBusiness?.name} />
      </SelectTrigger>
      <SelectContent>
        {businesses?.map((a) => (
          <SelectItem key={a.id} value={a.id as string}>
            {a.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
