"use client";
type Params = {
  params: {
    contentType: string;
  };
};

import { Collection } from "@/models/Collection";
import React, { useState, useEffect } from "react";
import { getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";
export default function ContentTypePage({ params: { contentType } }: Params) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const { toast } = useToast();
  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();
      setCollections(allCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch collections.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    return <div>Content type not found.</div>;
  }

  return (
    <>
      <h2>{selectedContentType.name}</h2>
      <p>{selectedContentType.description}</p>
    </>
  );
}
