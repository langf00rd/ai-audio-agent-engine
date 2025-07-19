"use client";
import { COOKIE_KEYS } from "@/lib/constants";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
export default function SignOutButton() {
  function clearBrowserData() {
    Cookies.remove(COOKIE_KEYS.token);
    Cookies.remove(COOKIE_KEYS.user);
    window.location.reload();
  }
  return <Button onClick={clearBrowserData}>Sign out</Button>;
}
