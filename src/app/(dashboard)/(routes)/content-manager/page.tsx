"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function ContentManagerRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/content-manager") {
    router.push("/content-manager/collections");
  }
}
