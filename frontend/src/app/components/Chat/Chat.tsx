"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styles from "./Chat.module.css"
import { useAccount } from 'wagmi';  
import { usePathname } from 'next/navigation'
import myconfig from "../../../myconfig.json"

interface ChatMessage {
  address: string;
  message: string;
  timestamp: string;
} 

//const socket = io(myconfig.serverUrl);

const socket = io(myconfig.serverUrl, {
  transports: ['polling', 'websocket'],
});

const Chat = () => {
  

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  //const [roomId, setRoomId] = useState<string>(""); // Room ID
  const roomId = useRef<string>("");
  const [walletAddress, setWalletAddress] = useState<string>(""); // Wallet Address
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false); // Track if the user has joined a room
  const { address, isConnected } = useAccount();
  const pathname = usePathname()
 
   
  useEffect(() => {
    console.log("pathname: ", pathname); // Log the pathname

    // Extract room ID from the pathname (assumes `/collab/[roomId]` format)
    const pathSegments = pathname.split("/");
    const roomIDFromPath = pathSegments[pathSegments.length - 1]; // Get the last part of the path
    if (roomIDFromPath) {
        
      //setRoomId(roomIDFromPath); // Set the room ID based on the URL
      roomId.current = roomIDFromPath;
      console.log("roomId: ", roomId.current);
      console.log("roomIDFromPath: ", roomIDFromPath);
      if(isConnected){
        joinRoom()
      }
      
    }
  }, []);


  useEffect(() => {
    if (joinedRoom) {
      socket.on("chat-message", (data: ChatMessage) => {
        console.log("Message received: ", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off("chat-message");
      };
    }
  }, [joinedRoom]);

  const joinRoom = () => {
    if (roomId.current && address) {
      socket.emit("join-room", roomId.current, address);
      console.log(`Joined room ${roomId.current} as ${address}`);
      setJoinedRoom(true);
    } else {
      alert("Please enter both room ID and wallet address");
    }
  };

  const sendMessage = () => {
    if (message.trim() && joinedRoom && roomId.current && address) {
        const temp = roomId.current;
      socket.emit("sentmessage", { roomId:roomId.current, message, address });
      setMessage("");
    } else {
      alert("Please join a room first");
    }
  };

  return (
    <div className={styles.chat_container}>
      <h2 className={`${styles.chat_title} rajdhani-medium`}>Chat</h2>
      
      <div className={styles.chat_box}>
        {messages.map((msg, index) => (
            <div key={index} className={`${styles.chat_message}`}>
            <strong className="font-rajdhani">
                {msg.address.slice(0, 4)}....{msg.address.slice(-4)}
            </strong>
            : {msg.message}{" "}
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
        ))}
        </div>

      <div className={`${styles.message_input_container} flex justify-center`}>
        <div>
            <input
            type="text"
            className={`${styles.input_field} font-rajdhani font-medium`}
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
        </div>

        <div className="btnsend">
            <button className="button font-rajdhani font-medium" onClick={sendMessage}>
            Send
            </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
