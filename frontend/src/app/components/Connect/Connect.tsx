'use client'; // Required for Next.js client-side rendering
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';  // Assuming you're using wagmi for wallet connect
import io from 'socket.io-client';
import "./Connect.css";
import TextToImagePage from '../Text2Image/Text2Image';

// Connect to Express.js server at localhost:4000
const socket = io('http://localhost:4000');  

interface DocumentEditorProps {
  docId: string;
}

const Connect: React.FC<DocumentEditorProps> = ({ docId }) => {
  const [content, setContent] = useState<string>(''); // Holds the document content
  const [isEditing, setIsEditing] = useState<boolean>(false); // Tracks if user is editing
  const [isApproved, setIsApproved] = useState<boolean>(false); // Tracks if user is approved to edit
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false); // Tracks if the approval request is pending

  // Get the wallet address from the connected wallet using useAccount
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Fetch the initial document content when the component loads
    fetch(`/api/document/${docId}`)
      .then((res) => res.json())
      .then((data) => setContent(data.content)); // Update state with fetched content

    // Join the room based on docId (unique per document) and wallet address
    if (isConnected && address) {
      socket.emit('join-room', docId, address);
    }

    // Listen for updates to the document content from other users
    socket.on('document-update', (newContent) => {
      setContent(newContent);  // Update the content when a broadcast is received
    });

    // Listen for wallet approval status
    socket.on('wallet-status', (status) => {
      setIsApproved(status === 'approved');
    });

    return () => {
      // Clean up listeners when component is unmounted
      socket.off('document-update');
      socket.off('wallet-status');
    };
  }, [docId, address, isConnected]); // Re-run effect when docId, address, or isConnected changes

  // Handle content editing
  const handleEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isApproved) {
      alert('You are not approved to edit this document.');
      return;
    }
    const newContent = e.target.value;
    setContent(newContent);
    setIsEditing(true);

    // Emit changes to other users in the same room
    socket.emit('edit-document', { roomId: docId, content: newContent, walletAddress: address });
  };

  // Handle wallet approval request
  const requestApproval = async () => {
    setIsRequestPending(true);
    const res = await fetch('/api/request-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: address }), // Use wallet address from wallet connect
    });
    const data = await res.json();
    if (data.status === 'pending') {
      alert('Your request is pending approval.');
    } else if (data.status === 'approved') {
      setIsApproved(true);
    }
    setIsRequestPending(false);
  };

  async function generateAI() {
    
  }

  return (
    <div className="container">
      <h1>Collab Prompt</h1>
      
      {/* Only show the editor if the user is connected to their wallet */}
      {isConnected ? (
        <div>
          {!isApproved && (
        <button onClick={requestApproval} disabled={isRequestPending || !address}>
          Request Approval
        </button>
      )}
          <textarea
            value={content}
            onChange={handleEdit}
            rows={10}
            cols={50}
            disabled={!isApproved}
          />

          <TextToImagePage prompt={content} />
          
          {!isApproved && <p>Your wallet address is not approved for editing.</p>}
        </div>
      ) : (
        <p>Please connect your wallet to proceed.</p>
      )}
    </div>
  );
};

export default Connect;
