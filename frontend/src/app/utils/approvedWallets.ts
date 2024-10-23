// utils/fetchWallets.ts
import myconfig from '../../myconfig.json'

export const approvedWallets = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${myconfig.serverUrl}/api/approved-wallets`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          console.log("response: ", response);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch wallets, status: ${response.status}`);
        }

        const data: string[] = await response.json();
        const adminWallet = process.env.NEXT_PUBLIC_ADMIN;

        // If there's an admin wallet in the environment variables, filter it out
        if (adminWallet) {
            return data.filter((wallet) => wallet !== adminWallet);
        }

        // Return the fetched data if no admin wallet needs to be filtered
        return data;
    } catch (error) {
        console.error('Error fetching wallets:', error);
        throw error; // Rethrow error to handle it in the calling component
    }
};
