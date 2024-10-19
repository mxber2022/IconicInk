'use client';

import { useState, useEffect } from 'react';

interface WalletRequest {
  walletAddress: string;
}

const CollabRequests: React.FC = () => {
  const [requests, setRequests] = useState<WalletRequest[]>([]);

  // Fetch pending wallet requests
  useEffect(() => {
    fetch('http://localhost:4000/api/pending-requests')
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  // Approve a wallet address
  const approveWallet = async (walletAddress: string) => {
    await fetch('http://localhost:4000/api/approve-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });

    // Refresh the list after approval
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.walletAddress !== walletAddress)
    );
  };

  // Reject a wallet address
  const rejectWallet = async (walletAddress: string) => {
    await fetch('/api/reject-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });

    // Refresh the list after rejection
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.walletAddress !== walletAddress)
    );
  };

  return (
    <div>
      <h1>Pending Wallet Approval Requests</h1>
      <ul>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map((request) => (
            <li key={request.walletAddress} className='font-rajdhani hehe'>
              {request.walletAddress}
              <button onClick={() => approveWallet(request.walletAddress)}>
                Approve
              </button>
              <button onClick={() => rejectWallet(request.walletAddress)}>
                Reject
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CollabRequests;
