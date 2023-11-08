"use client";
type Params = {
  params: {
    contentType: string;
  };
};
import { useRouter } from "next/navigation";
import { Collection } from "@/models/Collection";
import { Post } from "@/models/Post";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { getCollections } from "@/services/CollectionService";
import { useToast } from "@/hooks/use-toast";
import { Attribute, AttributeType } from "@/models/Attribute";
import { Button } from "@/components/ui/Button";
import { fields } from "@/utils/constants";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { addAttributesToCollection } from "@/services/ContentModelService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import DetailedView from "@/components/DetailedView";
import GridView from "@/components/GridView";
import ContentBuilderSideBar from "@/components/custom/ContentBuilderSideBar";
import { PostsTable } from "@/components/PostsTable";

export default function ContentTypePage({ params }: Params) {
  const { contentType } = params;

  const router = useRouter()
  const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({

    });
  const [collections, setCollections] = useState<Collection[]>([]);

  const [fieldsData, setFieldsData] = useState<Attribute[]>([]);
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
  };

  const selectedContentType = collections.find(
    (item) => item.name === contentType
  );
  if (!selectedContentType) {
    console.log(selectedContentType);
    return <div>Content type not found.</div>;
  }

  // const attributes: Attribute[] = selectedContentType
  //   ? selectedContentType.attributes
  //   : [];

 const posts : Post[] = []

 const redirectToCreatePage = (contentType) => {
  router.push(`/content-manager/collections/${contentType}/create`);
};

  return (
    <>
      <div className="md:flex">
        <ContentBuilderSideBar title="Content"   />
        <div className="flex-grow md:ml-72 mt-4">
          <h2>{selectedContentType.name}</h2>
          <p>{selectedContentType.description}</p>
          <div className="pl-56 pr-56">
            <div className="mt-6">
              <div className="container mx-auto py-10">
                <PostsTable
                  posts={posts}
                  onAddFieldClick={() => redirectToCreatePage(params.contentType)}
                />

                <Dialog
                  open={isDialogOpen}
                  onOpenChange={() => {
                   
                    setIsDialogOpen(!isDialogOpen);
                  }}
                >
                  <DialogContent className="w-full max-w-xl sm:max-w-3xl">
                    <form onSubmit={handleSubmit} noValidate>
                      <DialogHeader className="flex justify-between">
                   
                          <>
                            <DialogTitle>
                              {selectedContentType.name}
                            </DialogTitle>
                            <DialogDescription>
                              Select a field for your collection type
                            </DialogDescription>
                          </>
                  
                     
                  
                      </DialogHeader>

                          <DialogFooter>
                            <DialogClose>
                              <Button
                                variant="outline"
                                type="button"
                                id="cancelButton"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              id="finishButton"
                              type="submit"
                              disabled={!isValid}
                            >
                              Finish
                            </Button>
                          </DialogFooter>
                   
                 
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
