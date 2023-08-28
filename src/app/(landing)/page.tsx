"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkAdminExists } from "@/services/AdminService";
import AdminRegistration from "@/components/AdminRegistration";

const LandingPage = () => {
  const router = useRouter();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Check local storage for the adminExists value
      const adminExistsInLocalStorage = localStorage.getItem("adminExists");
      if (adminExistsInLocalStorage !== null) {
        setAdminExists(adminExistsInLocalStorage === "true");
        return; // If found in local storage, skip the API call
      }

      const result = await checkAdminExists();
      localStorage.setItem("adminExists", result.toString()); // Convert to string before storing
      setAdminExists(result);
    }

    fetchData();
  }, []);
  useEffect(() => {
    if (adminExists) {
      router.push("/sign-in");
    }
  }, [adminExists]);
  //   If adminExists state is null, don't render anything
  if (adminExists === null) {
    return null;
  }

  if (adminExists) {
    return null;
  } else {
    return <AdminRegistration />;
  }
};

export default LandingPage;
