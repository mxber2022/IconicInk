import Connect from "@/app/components/Connect/Connect";

interface DocumentPageProps {
  params: { id: string };
}

const DocumentPage = ({ params }: DocumentPageProps) => {
  const { id } = params;

  return <Connect docId={id} />;
};

export default DocumentPage;
