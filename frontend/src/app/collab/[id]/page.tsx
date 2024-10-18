import Connect from "@/app/components/Connect/Connect";
import Chat from "@/app/components/Chat/Chat";

interface DocumentPageProps {
  params: { id: string };
}

const DocumentPage = ({ params }: DocumentPageProps) => {
  const { id } = params;

  return (

    <>
  <div className="flex space-x-4 items-start max-w-screen-lg mx-auto">
    <div className="w-full">
      <Connect docId={id} />
    </div>

    <div className="w-full">
      <Chat />
    </div>
  </div>
</>

  )
};

export default DocumentPage;
