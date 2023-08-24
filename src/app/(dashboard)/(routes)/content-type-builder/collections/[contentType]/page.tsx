type Params = {
  params: {
    contentType: string;
  };
};
const contentTypes = [
  { id: "user", name: "User", description: "This is the User content type." },
  {
    id: "webinar",
    name: "Webinar",
    description: "This is the Webinar content type.",
  },
];
export default async function ContentTypePage({
  params: { contentType },
}: Params) {
  const selectedContentType = contentTypes.find(
    (item) => item.id === contentType
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
