import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog";
import FormFieldGroup from "./FormFieldGroup";
import FormGrid from "./FormGrid";
import { useEffect, useRef, useState } from "react";
import { Collection } from "@/models/Collection";
import { addCollection, getCollections } from "@/services/CollectionService";
import {  useToast } from "@/hooks/use-toast";
import { useFormWithValidation } from "@/hooks/useFormWithValidation";
import { AxiosError } from "axios";
import { getErrors } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ContentModelDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);
    const { values, errors, isValid, handleChange, setValues } =
    useFormWithValidation({
      name: "",
      description: "",
    });
    const { toast } = useToast();
    const router = useRouter();
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

    const createCollection = async (collectionData: Collection) => {
        // Check if collection name already exists
        const doesNameExist = collections.some(
          (collection) => collection.name === collectionData.name
        );
        if (doesNameExist) {
          toast({
            title: "Error",
            description: "Collection name already exists!",
            variant: "destructive",
          });
          setSubmitted(false); // Reset the submitted state to allow another attempt
          return; // Exit the function early, preventing the API call
        }
    
        try {
          const newCollection = await addCollection(collectionData);
          // Add the new collection to the state
          setCollections((prevCollections) => [...prevCollections, newCollection]);
    
          toast({
            title: "Success",
            description: "You have successfully added a new collection.",
            variant: "success",
          });
    
          closeDialogButtonRef.current?.click();
          if (newCollection.name) {
            router.push(`/content-type-builder/collections/${newCollection.name}`);
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMessage = getErrors(axiosError);
          console.error("Error adding a new collection:", errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          setSubmitted(false);
        }
      };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const collectionData: Collection = {
          name: values.name,
          description: values.description,
        };
        setSubmitted(true);
        createCollection(collectionData);
      };
    return (
        <Dialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
      >
        <DialogTrigger asChild>
          <Button
            id="createNewCollectionButton"
            style={{
              backgroundColor: "transparent",
              color: "#0075FF",
              paddingLeft: "0",
            }}
          >
            &#43; Create new collection
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add collection</DialogTitle>
            <DialogDescription>
              Create a new collection type. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form id="collection-form" onSubmit={handleSubmit} noValidate>
            <FormGrid>
              <div className="col-span-full">
                <FormFieldGroup
                  label="Name"
                  name="name"
                  id="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={15}
                  value={values.name}
                  onChangeInput={handleChange}
                  error={errors.name}
                  pattern="^[a-zA-Z\s]+$"
                />
              </div>

              <div className="col-span-full">
                <FormFieldGroup
                  useTextarea
                  label="Description"
                  name="description"
                  id="description"
                  required
                  value={values.description}
                  onChangeTextArea={handleChange}
                  error={errors.description}
                />
              </div>
            </FormGrid>

            <DialogFooter style={{ paddingTop: "48px" }}>
              <DialogClose ref={closeDialogButtonRef}>
                <Button variant="outline" type="button" id="cancelButton">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="addCollectionButton"
                type="submit"
                disabled={submitted || !isValid}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
}

export default ContentModelDialog