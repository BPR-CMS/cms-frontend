"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/content-type-builder") {
    router.push("/content-type-builder/collections");
  }
}
