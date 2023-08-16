import { checkAdminExists } from "@/services/AdminService";
import AdminRegistration from "@/components/AdminRegistration";

export default async function Home() {
  const adminExists = await checkAdminExists();

  if (adminExists) {
    return <h1>Hello</h1>;
  } else {
    return (
      <>
        <AdminRegistration />
      </>
    );
  }
}
