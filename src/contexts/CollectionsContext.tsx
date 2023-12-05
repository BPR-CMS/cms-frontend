"use client";
import { Collection } from "@/models/Collection";
import { getCollections } from "@/services/CollectionService";
import React, { createContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
const CollectionsContext = createContext(null);

export const CollectionsProvider = ({ children }) => {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);

  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();

      if (allCollections.length === 0) {
        setCollections([]);

        return;
      }

      setCollections(allCollections);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching collections:", error.message);

        if (error.message !== "No collections found") {
          toast({
            title: "Error",
            description: "Failed to fetch collections.",
            variant: "destructive",
          });
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <CollectionsContext.Provider value={{ collections }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export default CollectionsContext;
