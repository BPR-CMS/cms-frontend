import { Post } from "@/models/Post";
import { Files, PlusIcon } from "lucide-react";
import { DataTable } from "./custom/DataTable";
import { Button } from "./ui/Button";
import { ColumnDef } from "@tanstack/react-table";
import { getPostsByCollectionId } from "@/services/PostService";
import { useEffect, useState } from "react";
import { Attribute } from "@/models/Attribute";
export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "attributes.title",
    header: "Name",
  },
  {
    accessorKey: "_id.date",
    header: "Created at",
  },
];
type PostsTableProps = {
  collectionId: string;
  onAddFieldClick: () => void;
  attributes: Attribute[];
};

export const PostsTable: React.FC<PostsTableProps> = ({
  collectionId,
  onAddFieldClick,
  attributes,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  // Function to format the date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  // Extracting the first attribute key from the first post
  const firstAttributeKey =
    posts.length > 0 ? Object.keys(posts[0].attributes)[0] : null;

  // Defining columns for the first attribute and the created date
  let dynamicColumns = [];

  if (firstAttributeKey) {
    dynamicColumns.push({
      accessorKey: `attributes.${firstAttributeKey}`,
      header:
        firstAttributeKey.charAt(0).toUpperCase() + firstAttributeKey.slice(1),
    });
  }

  // Adds a column for the formatted creation date
  dynamicColumns.push({
    id: "created_at",
    header: "Created at",
    cell: ({ row }) => formatDate(row.original._id.date),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  console.log(collectionId);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getPostsByCollectionId(collectionId);
        setPosts(fetchedPosts);
      } catch (error) {
        setError("Failed to fetch posts");
        console.log("error failed");
      } finally {
        setLoading(false);
      }
    };
    if (collectionId) {
      fetchPosts();
    }
  }, [collectionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DataTable
      defaultButtonLabel="Create new entry"
        id="fieldsTable"
        columns={dynamicColumns}
        data={posts}
        emptyStateComponent={
          <div className="flex flex-col items-center space-y-4">
            <Files size={60} color="#0075ff" />
            <p>No content found</p>
            {posts.length === 0 && (
              <Button
                id="addEntryButton"
                className="flex items-center space-x-2 mt-4"
                onClick={onAddFieldClick}
              >
                <PlusIcon />
                <span>Create new entry</span>
              </Button>
            )}
          </div>
        }
      />
      {posts.length > 0 && (
        <Button
          id="addNewEntryButton"
          className="flex items-center space-x-2 mt-4"
          onClick={onAddFieldClick}
        >
          <PlusIcon />
          <span>Add new entry</span>
        </Button>
      )}
    </>
  );
};
