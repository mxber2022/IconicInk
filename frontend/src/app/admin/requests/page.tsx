'use client';

import { useState, useEffect } from 'react';
import GetApprovedWallets from '@/app/components/GetApprovedWallets/GetApprovedWallets';
import styles from "./page.module.css"

interface WalletRequest {
  walletAddress: string;
}

const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<WalletRequest[]>([]);
  const [refresh, setRefresh] = useState(false);
  // Fetch pending wallet requests
  useEffect(() => {
    fetch('http://localhost:4000/api/pending-requests')
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching pending requests:", err));
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

    setRefresh(!refresh);
  };

  // Reject a wallet address
  const rejectWallet = async (walletAddress: string) => {
    await fetch('http://localhost:4000/api/reject-wallet', {
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
    <>
    <div className={`${styles['wallet-requests']} font-rajdhani`}>
      <h1 className={styles.title}>Pending Wallet Approval Requests</h1>
      <ul className={styles['request-list']}>
        {requests.length === 0 ? (
          <p className={styles['no-requests']}>No pending requests</p>
        ) : (
          requests.map((request) => (
            <li key={request.walletAddress} className={styles['request-item']}   >
              <span className= {styles['wallet-address']} >{request.walletAddress}</span>
              <div className={styles.actions} >
                <button 
                  className={styles['approve-btn']} 
                  onClick={() => approveWallet(request.walletAddress)}>
                  Approve
                </button>
                <button 
                  className={styles['reject-btn']}
                  onClick={() => rejectWallet(request.walletAddress)}>
                  Reject
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
    <GetApprovedWallets refresh={refresh} />
    </>
  );
};

export default AdminRequestsPage;
