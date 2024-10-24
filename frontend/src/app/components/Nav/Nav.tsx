"use client"
import styles from "./Nav.module.css";
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from "react";
import { approvedWallets } from "@/app/utils/approvedWallets";

const owner = process.env.NEXT_PUBLIC_ADMIN;
function Nav() {

    const { address, isConnected } = useAccount();

    const [wallets, setWallets] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletsData = await approvedWallets();
                setWallets(walletsData);
            } catch (err) {
                setError('Failed to fetch wallets');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return(
        <nav className={styles.nav}>
            <div className={styles.nav__container}>
                <div className={styles.nav__left}>
                    <div>
                        <Link href="/" style={{ color: 'black', textDecoration: 'none' } }>
                            <div className={styles.nav__logo}>
                                IconicInk
                                
                            </div>
                            
                        </Link>
                    </div>

                    {/* <div >
                        <Link href="/Donate" style={{ color: 'black', textDecoration: 'none' }}>
                            
                        </Link>
                    </div>

                    <div >
                        <Link href="/Bridge" style={{ color: 'black', textDecoration: 'none' }}>
                        
                        </Link>
                    </div>

                    <div >
                        <Link href="/Presentation" style={{ color: 'black', textDecoration: 'none' }}>
                        
                        </Link>
                    </div>
*/}
                    <div >
                        <Link href="" style={{ color: 'black', textDecoration: 'none' }}>
                        <p className={styles.tagline} > Where Icons and Fans Create Sign Mint </p>

                        </Link>
                    </div> 

                    <div >
                        <Link className={"rajdhani-medium"} href="/collab/mx" style={{ color: 'black', textDecoration: 'none' }}>
                        COLLAB
                        </Link>
                    </div>


                    {
                    address === process.env.NEXT_PUBLIC_ADMIN && (
                        <div>
                            <Link className="rajdhani-medium" href="/admin/requests" style={{ color: 'black', textDecoration: 'none' }}>
                                ADMIN
                            </Link>
                        </div>
                    )
                    }
                    { owner === address && wallets[0] && (
                        <div>
                            <Link className="rajdhani-medium" href={""} style={{ color: 'black', textDecoration: 'none' }}>
                                LUCKYFAN: {`${wallets[0]}`}
                            </Link>
                        </div>
                    )  
                    }

                    {
                         owner != address &&(
                            <>
                            <Link className="rajdhani-medium " href={""} style={{ color: 'red', textDecoration: 'none' }}>
                                FANPAGE
                            </Link>
                            </>
                        )

                    }

                </div>
                <div className={styles.nav__right}>
                    <w3m-button />
                </div>
            </div>
        </nav>
    )
}

export default Nav;