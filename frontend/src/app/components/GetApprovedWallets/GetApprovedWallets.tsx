'use client';

import "./GetApprovedWallets.css"
import { useState, useEffect } from 'react';

interface WalletRequest {
  walletAddress: string;
}

interface GetApprovedWalletsProps {
  refresh: boolean;
}

const GetApprovedWallets: React.FC<GetApprovedWalletsProps> = ({ refresh }) => {
  const [wallets, setWallets] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/approved-wallets')
      .then((res) => res.json())
      .then((data) => setWallets(data))
      .catch((err) => console.error("Error fetching wallets: ", err));
  }, [refresh]);

  return (
    <div className="wallet-requests">
      <h1 className='font-rajdhani'>Approved Fan Wallets</h1>
      <ul>
        {wallets.length === 0 ? (
          <p className="no-requests font-rajdhani">No Approved Wallet</p>
        ) : (
          wallets.map((walletAddress) => (
            <li key={walletAddress} className="request-item">
              <span className="wallet-address font-rajdhani">{walletAddress}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GetApprovedWallets;
