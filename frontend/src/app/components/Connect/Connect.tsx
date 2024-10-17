"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');  // Connect to Express.js server

interface DocumentEditorProps {
  docId: string;
}

const Connect: React.FC<DocumentEditorProps> = ({ docId }) => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the initial document content
    fetch(`/api/document/${docId}`)
      .then((res) => res.json())
      .then((data) => setContent(data.content));

    // Join the room based on docId
    socket.emit('join-room', docId);

    // Listen for document updates
    socket.on('document-update', (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.off('document-update');
    };
  }, [docId]);

  // Handle content editing
  const handleEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsEditing(true);

    // Emit changes to other users
    socket.emit('edit-document', { roomId: docId, content: newContent });
  };

  return (
    <div>
      <h1>Document Editor</h1>
      <textarea
        value={content}
        onChange={handleEdit}
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default Connect;
