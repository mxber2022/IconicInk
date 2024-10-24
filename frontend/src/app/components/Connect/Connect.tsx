'use client'; // Required for Next.js client-side rendering
import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';  // Assuming you're using wagmi for wallet connect
import io from 'socket.io-client';
import styles from './Connect.module.css';
import TextToImagePage from '../Text2Image/Text2Image';
import {abi} from "./abi"
import { useWriteContract } from 'wagmi'
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { approvedWallets } from '@/app/utils/approvedWallets'
import myconfig from "../../../myconfig.json"

import haha from "../storyUtils/metadataExample"
// Connect to Express.js server at localhost:4000
//const socket = io(myconfig.serverUrl);  
const socket = io(myconfig.serverUrl, {
  transports: ['polling', 'websocket'],
});
const owner = process.env.NEXT_PUBLIC_ADMIN;

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

  const [status, setStatus] = useState<string>('MintOnStory');
  const [uri, setUri] = useState<string>('');
  const [walletGotApproved, setWallerGotApproved] = useState<string>('');


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
      console.log("status: ", status);
    });

    socket.on('wallet__approved', (data: any) => {
     // setIsApproved(status === 'approved');
      setWallerGotApproved(data.walletAddress)
      console.log("status data : ", data);
    });

    socket.on('ai-image-generated', (imageUrl) => {
      setGeneratedImage(imageUrl); // Set the generated image URL
      console.log("imageUrl: ", imageUrl )
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
    if (!isApproved && walletGotApproved !== address) {
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
    const res = await fetch(`${myconfig.serverUrl}/api/request-approval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: address }), // Use wallet address from wallet connect
    });
    const data = await res.json();
    if (data.status === 'pending') {
      //alert('Your request is pending approval.');

      Toastify({
        text: "Your request is sent",
        duration: 3000, // 3 seconds
        close: false,
        gravity: "top", // Position the toast at the top
        position: "center", // Center the toast
        backgroundColor: "black", // Solid dark color
        stopOnFocus: true, // Prevents the toast from closing on hover
        style: {
          border: "2px solid #000", // Black border
          borderRadius: "10px", // Optional: Rounded edges
          fontFamily: "'Courier New', monospace"
        }
      }).showToast();

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
    image.crossOrigin = "Anonymous"; 

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

  const { writeContract, isSuccess, data: writeContractData, status: writeContractStatus, error } = useWriteContract();
  
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove the base64 metadata
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type);
    });
  };
  
  const mint = async () => {
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }
  
    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Canvas context not found.");
      return;
    }
  
    try {
      // Convert the canvas to a Blob
      const blob = await canvasToBlob(canvas, 'image/png');
  
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }
  
      // Convert Blob to base64
      const base64Blob = await convertBlobToBase64(blob);
      
      console.log("Generated base64 blob: ", base64Blob);
  
      // IPFS upload logic
      const response = await fetch('/api/uploadToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blob: base64Blob }), // Send base64-encoded blob
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('IPFS Upload Result:', data);
      } else {
        console.error('Error:', data.message);
      }
  
      // Optional image display logic
      const url = URL.createObjectURL(blob);
      const newImg = document.createElement('img');
      newImg.src = url;
     // document.body.appendChild(newImg);
  
      newImg.onload = () => {
        URL.revokeObjectURL(url); // Free memory
      };
      
      console.log("data",data.IpfsHash)
      /*
        Mint nft
      */
      writeContract({ 
        abi,
        address: "0xAaa906c8C2720c50B69a5Ba54B44253Ea1001C98",
        functionName: 'safeMint',  // createMarket
        args: [ 
          "0x7199D548f1B30EA083Fe668202fd5E621241CC89",
          data.IpfsHash
        ]
      });


      /*
        for story
      */
        

    } catch (error) {
      console.error("Error during the minting process:", error);
    }
  };
  
  async function mintOnStory() {
    setStatus("on ipfs ...");
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }
  
    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Canvas context not found.");
      return;
    }
  
    try {
      // Convert the canvas to a Blob
      const blob = await canvasToBlob(canvas, 'image/png');
  
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }
  
      // Convert Blob to base64
      const base64Blob = await convertBlobToBase64(blob);
      
      console.log("Generated base64 blob: ", base64Blob);
  
      // IPFS upload logic
      const response = await fetch('/api/uploadToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blob: base64Blob }), // Send base64-encoded blob
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('IPFS Upload Result:', data);
      } else {
        console.error('Error:', data.message);
      }
  
      // Optional image display logic
      const url = URL.createObjectURL(blob);
      const newImg = document.createElement('img');
      newImg.src = url;
     // document.body.appendChild(newImg);
  
      newImg.onload = () => {
        URL.revokeObjectURL(url); // Free memory
      };
      
      console.log("data",data.IpfsHash)
      setStatus("Minting ...");
      const hashuri = await haha(data.IpfsHash)
      setUri(hashuri)
      setStatus("Minted");
        
      } catch (error) {
        console.error("Error during the minting process:", error);
      }
  }

  const [statuss, setStatuss] = useState<string>('MintOnBase');
  const mintonbase = async () => {
    setStatuss("on ipfs ...");
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }
  
    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Canvas context not found.");
      return;
    }
  
    try {
      // Convert the canvas to a Blob
      const blob = await canvasToBlob(canvas, 'image/png');
  
      if (!blob) {
        console.error("Failed to convert canvas to blob.");
        return;
      }
  
      // Convert Blob to base64
      const base64Blob = await convertBlobToBase64(blob);
      
      console.log("Generated base64 blob: ", base64Blob);
  
      // IPFS upload logic
      const response = await fetch('/api/uploadToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blob: base64Blob }), // Send base64-encoded blob
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('IPFS Upload Result:', data);
      } else {
        console.error('Error:', data.message);
      }
  
      // Optional image display logic
      const url = URL.createObjectURL(blob);
      const newImg = document.createElement('img');
      newImg.src = url;
     // document.body.appendChild(newImg);
  
      newImg.onload = () => {
        URL.revokeObjectURL(url); // Free memory
      };
      
      console.log("data",data.IpfsHash)
      /*
        Mint nft
      */
      setStatuss("Minting...");
      const walletsData = await approvedWallets();
      console.log("walletsData:", walletsData);

      writeContract({ 
        abi,
        address: "0x4EEc84B0f4Fb1c035013a673095b1E7e73ea63cc",
        functionName: 'safeMint',  // createMarket
        args: [ 
          walletsData[0],
          data.IpfsHash
        ]
      });
      
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 10000); // 10,000 milliseconds = 10 seconds
      });

      setStatuss("Minted");
        

    } catch (error) {
      console.error("Error during the minting process:", error);
    }
  };
  
  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} rajdhani-medium `}>PromptFusion</h2>
      
      {/* Only show the editor if the user is connected to their wallet */}
      {isConnected ? (
        <div>
          {(!isApproved && walletGotApproved !== address) && (
            <button onClick={requestApproval} disabled={isRequestPending || !address} className={`${styles['button']} font-rajdhani`}>
            Request Approval
        </button>
      )}
          <textarea
            value={content}
            onChange={handleEdit}
            rows={10}
            cols={50}
            disabled={!isApproved && walletGotApproved !== address}
            className={`${styles.textarea} font-rajdhani mt-5 bg-white`}
          />

          <TextToImagePage prompt={content} roomId={docId} />

          {/* Display the generated image */}
          {generatedImage && (
            <div className={styles.ai}>
              <h1 className='rajdhani-regular' >Generated AI Image:</h1>
              <img src={generatedImage} alt="Generated AI"/>      
              {
                address == owner && (
                  <>
                  <h1 className='rajdhani-regular'>Generated AI Image with Signature:</h1>
                {/* Main canvas for displaying the image */}
                <canvas id="imageCanvas" ref={canvasRef} />
                    <h4 className='font-rajdhani' >Draw your signature:</h4>
                    {/* Canvas for drawing the signature */}
                    <canvas
                      id="signatureCanvas"
                      ref={signatureCanvasRef}
                      width={512} 
                      height={200}
                      style={{ border: '1px solid black' }}
                      onMouseDown={startDrawing}
                      onMouseMove={drawSignature}
                      onMouseUp={stopDrawing}
                    />
                    <div className='flex'>
                      <div className='mr-4'>
                        <button onClick={addSignatureToImage} className='button font-rajdhani'>Add Signature to Image</button>
                      </div>
                      {/* <div className='mr-4'>
                        <button onClick={mint} className='send-button font-rajdhani'>MintOnZora</button>
                      </div>
                      <div className='mr-4'>
                        <button onClick={mintOnStory} className='send-button font-rajdhani'>{status}</button>
                      </div> */}
                    
                      <div className='mr-4'>
                        <button onClick={mintonbase} className='button font-rajdhani'>{statuss}</button>
                      </div>
                    </div>
                    
                    {
                     <p className='rajdhani-semibold'><a href={uri} target="_blank" rel="noopener noreferrer">{uri}</a></p>
                    }
                    
                  </>
                )
              }
              
            </div>
          )}
          
          {/* {!isApproved  && (<p className="font-rajdhani hello">Your wallet address is not approved for editing prompt.</p>)} */}
        </div>
      ) : (
        <p className="font-rajdhani hehe">Please connect your wallet to proceed.</p>
      )}
    </div>
  );
};

export default Connect;
