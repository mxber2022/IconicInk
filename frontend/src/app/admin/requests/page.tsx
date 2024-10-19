'use client';

import { useState, useEffect } from 'react';

interface WalletRequest {
  walletAddress: string;
}

const AdminRequestsPage: React.FC = () => {
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
    <div className="wallet-requests font-rajdhani">
  <h1>Pending Wallet Approval Requests</h1>
  <ul>
    {requests.length === 0 ? (
      <p className="no-requests">No pending requests</p>
    ) : (
      requests.map((request) => (
        <li key={request.walletAddress} className="request-item font-rajdhani">
          <span className="wallet-address">{request.walletAddress}</span>
          <div className="actions">
            <button className="approve-btn" onClick={() => approveWallet(request.walletAddress)}>
              Approve
            </button>
            <button className="reject-btn" onClick={() => rejectWallet(request.walletAddress)}>
              Reject
            </button>
          </div>
        </li>
      ))
    )}
  </ul>
</div>
  );
};

export default AdminRequestsPage;
