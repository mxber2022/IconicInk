'use client'; // Required for Next.js client-side rendering
import { useEffect, useState, useRef } from 'react';
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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference for the canvas where user draws the signature
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null); // For the signature canvas
  const [drawing, setDrawing] = useState(false); // Tracks whether the user is currently drawing

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

    socket.on('ai-image-generated', (imageUrl) => {
      setGeneratedImage(imageUrl); // Set the generated image URL
    });

    return () => {
      // Clean up listeners when component is unmounted
      socket.off('document-update');
      socket.off('wallet-status');
      socket.off('ai-image-generated');
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
    const res = await fetch('http://localhost:4000/api/request-approval', {
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

  // Function to start drawing the signature on the signature canvas
  const startDrawing = (event: React.MouseEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setDrawing(true);
  };

  // Function to continue drawing the signature
  const drawSignature = (event: React.MouseEvent) => {
    if (!drawing) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
  };

  // Function to stop drawing the signature
  const stopDrawing = () => {
    setDrawing(false);
  };

  // Function to add the custom signature to the generated image using Canvas
  const addSignatureToImage = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = new Image();
    image.src = generatedImage!;

    image.onload = function () {
      if (canvas && context) {
        // Set canvas dimensions to match the image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image on the canvas
        context.drawImage(image, 0, 0);

        // Overlay the signature from the signature canvas
        const signatureCanvas = signatureCanvasRef.current;
        if (signatureCanvas) {
          context.drawImage(signatureCanvas, 0, 0); // Draw the signature on top of the image
        }
      }
    };
  };

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

          <TextToImagePage prompt={content} roomId={docId} />

          {/* Display the generated image */}
          {generatedImage && (
            <div>
              <h3>Generated AI Image:</h3>
              <img src={generatedImage} alt="Generated AI" />

              <h3>Generated AI Image with Signature:</h3>
              {/* Main canvas for displaying the image */}
              <canvas id="imageCanvas" ref={canvasRef} />

              <h4>Draw your signature:</h4>
              {/* Canvas for drawing the signature */}
              <canvas
                id="signatureCanvas"
                ref={signatureCanvasRef}
                width={500} 
                height={200}
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseMove={drawSignature}
                onMouseUp={stopDrawing}
              />

              <button onClick={addSignatureToImage}>Add Signature to Image</button>
            </div>
          )}
          
          {!isApproved && <p>Your wallet address is not approved for editing.</p>}
        </div>
      ) : (
        <p>Please connect your wallet to proceed.</p>
      )}
    </div>
  );
};

export default Connect;
