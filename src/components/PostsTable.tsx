import { Post } from "@/models/Post";
import { Files, PlusIcon } from "lucide-react";
import { DataTable } from "./custom/DataTable";
import { Button } from "./ui/Button";
import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
];
type PostsTableProps = {
  posts: Post[];
  onAddFieldClick: () => void;
};

export const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  onAddFieldClick,
}) => {
  return (
    <>
      <DataTable
        id="fieldsTable"
        columns={columns}
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
