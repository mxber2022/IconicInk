"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

interface ChatMessage {
  walletAddress: string;
  message: string;
  timestamp: string;
}

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomId, setRoomId] = useState<string>(""); // Room ID
  const [walletAddress, setWalletAddress] = useState<string>(""); // Wallet Address
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false); // Track if the user has joined a room

  useEffect(() => {
    // Only register the event listener after the room has been joined
    if (joinedRoom) {
      socket.on("chat-message", (data: ChatMessage) => {
        console.log("Message received: ", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      // Cleanup on component unmount
      return () => {
        socket.off("chat-message");
      };
    }
  }, [joinedRoom]);

  const joinRoom = () => {
    if (roomId && walletAddress) {
      // Emit the join-room event to the backend
      socket.emit("join-room", roomId, walletAddress);
      console.log(`Joined room ${roomId} as ${walletAddress}`);
      setJoinedRoom(true); // Mark room as joined
    } else {
      alert("Please enter both room ID and wallet address");
    }
  };

  const sendMessage = () => {
    if (message.trim() && joinedRoom && roomId && walletAddress) {
      // Emit the message to the backend
      socket.emit("sentmessage", { roomId, message, walletAddress });

      // Clear the message input after sending
      setMessage("");
    } else {
      alert("Please join a room first");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.walletAddress}:</strong> {msg.message}{" "}
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <style jsx>{`
        .chat-box {
          height: 200px;
          overflow-y: scroll;
          border: 1px solid #ccc;
          padding: 10px;
          margin-top: 10px;
        }
        .chat-message {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Chat;
