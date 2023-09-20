"use client";

import React, { useState, useEffect } from "react";
import { Collection } from "@/models/Collection";
import { getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";

import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
import ContentModelDialog from "@/components/custom/ContentModelDialog";
export default function CollectionsPage() {
  const [selectedContentType, setSelectedContentType] =
    useState<Collection | null>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // const handleOpenDialog = () => {
  //   setIsDialogOpen(true);
  // };

  return (
    <div className="md:flex">
      <ContentBuilderSideBar />
      <div className="flex-grow md:ml-72 mt-4">
        {!selectedContentType && collections.length == 0 && (
          <div className=" mt-4">
            <div className="flex justify-center items-center h-full p-8">
              <div className="flex justify-between items-center w-full">
                <div className="pr-8 w-1/2">
                  <h1 className="text-xxs  font-bold leading-1 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
                    First, design the content model
                  </h1>
                  <p className="mb-6 mt-6">
                    The content model is a collection of all different types of
                    content for a project. It is a schema that editors
                    repeatably use and fill with content.
                  </p>
                  {/* <Button onClick={handleOpenDialog}>
                    Design your content model
                  </Button> */}
                  <ContentModelDialog />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
