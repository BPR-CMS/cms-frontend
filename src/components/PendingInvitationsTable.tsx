import { DataTable } from "./custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/models/User";
import { Button } from "./ui/Button";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
];

type PendingInvitationsTableProps = {
  users: User[];
  buttonLabel: string;
  onButtonClick: (user: User) => () => void;
};

export const PendingInvitationsTable: React.FC<
  PendingInvitationsTableProps
> = ({ users, buttonLabel, onButtonClick }) => {
  return (
    <>
      <DataTable
        id="usersTable"
        columns={columns}
        data={users}
        renderButton={(rowData) => buttonLabel}
        onButtonClick={(rowData) => onButtonClick(rowData)}
      />
    </>
  );
};
