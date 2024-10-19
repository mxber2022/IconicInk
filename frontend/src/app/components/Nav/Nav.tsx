"use client"
import "./Nav.css";
import Link from 'next/link';
import { useAccount } from 'wagmi';

function Nav() {

    const { address, isConnected } = useAccount();

    return(
        <nav className="nav">
            <div className="nav__container">
                <div className="nav__left">
                    <div>
                        <Link href="/" style={{ color: 'black', textDecoration: 'none' } }>
                            <div className="nav__logo ">
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
                        <Link href="/Presentation" style={{ color: 'black', textDecoration: 'none' }}>
                        <p className="tagline" > Where Icons and Fans Create Sign Mint </p>

                        </Link>
                    </div> 

                    <div >
                        <Link className="rajdhani-medium " href="/collab/mx" style={{ color: 'black', textDecoration: 'none' }}>
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

                </div>
                <div className="nav__right">
                <w3m-button />
                </div>
            </div>
        </nav>
    )
}

export default Nav;