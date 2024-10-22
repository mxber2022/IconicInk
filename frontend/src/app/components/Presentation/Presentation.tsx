"use client"

import { useState } from "react";
import styles from "./Presentation.module.css"
import Image from 'next/image';

function Presentation() {
        const [currentSlide, setCurrentSlide] = useState(0);

        const slides = [
            {
                title: "",
                content: (
                    <>
                        <p><strong>Name:</strong> MX</p>
                        <p><strong>Date:</strong> 20.Oct 2024</p>
                        <p><strong>Project: </strong> IconicInk</p>
                        <p><strong>Goal: </strong> Where Icons and Fans Create Sign Mint </p>
                    </>
                ),
            },
            {
                title: "About IconicInk",
                content: (
                    <>
                        <h2></h2>
                        <p><strong></strong> A platform where celebrities or influencers can collaborate with their fans to create AI-generated art. The process is interactive and personalized—both the celebrity and an approved fan can edit the AI prompt together and chat, adding a creative and collaborative touch to the final result. Once the image is generated, the celebrity can digitally sign it, adding authenticity and mint it as an NFT and transferring ownership to the fan. This platform merges fan engagement with creative co-creation, allowing for unique, signed digital artwork that embodies the collaboration between celebrities and their fans. </p>
                    </>
                ),
            },
            {
                title: "Why IconicInk",
                content: (
                    <>
                        <h2></h2>
                        <p><strong>Enhanced Fan Engagement:</strong> Fans get a deeper, more meaningful interaction with celebrities by co-creating unique art together. </p>
                        <p><strong>Personalized and Authentic Content:</strong> The platform allows fans and celebrities to collaborate on personalized, one-of-a-kind creations. </p>
                        <p><strong>Monetization and New Revenue Streams:</strong> Celebrities can monetize their fan engagement by selling co-created NFT artwork. </p>
                        <p><strong>Innovation in AI and Creative Expression:</strong> The platform leverages AI to empower both fans and celebrities in the creative process. </p>
                        <p><strong>NFT Collectibles with Emotional Value:</strong> Fans can own emotionally meaningful, signed digital collectibles from their favorite celebrities. </p>
                        <p><strong>Exclusive Access and Fandom Prestige:</strong> Only select fans can collaborate, offering exclusive interactions and fan prestige. </p>
                        <p><strong>Leveraging the Growing NFT and Web3 Market:</strong> The platform taps into the booming NFT and Web3 space for fan-driven, decentralized experiences. </p>

                    </> 
                ),
            },
    
            {
              title: "Flow Diagram",
              content: (
                  <>
                    <h2></h2>
                    {/* <p><strong> </strong>Snap helps web2 platform like twitter, facebook etc to bring Web3 functionalities like blockchain transactions and smart contract interactions in the form of tweet(twitter) and post(facebook) </p> */}
                    <Image
                    src="/flow.png" // Local image path in the `public` folder or an external link
                    alt="Description of the image"
                    width={1000} // Width of the image
                    height={1000} // Height of the image
                    />
                  </> 
              ),
            },
    
    
            {
                title: "Demo",
                content: (
                    <>
                       {/* <h2></h2>
                       <p><strong>Goal:</strong> is to make crosschain donation using wormhole on twitter(post). </p>
                       <p><strong></strong> We will donate 1 USDC from Ethereum sepolia to optimism sepolia. </p>
                       <br></br>
                       <video width="600" controls>
                        <br></br>
                    <source src="/finalsnapha.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}
                    </>
                ),
            },
            {
                title: "Features To Be Added",
                content: (
                    <>
                        <h2></h2>
                        <p><strong>Live Video Collaboration Mode: </strong>Enable vide mode</p>
                        <p><strong>Voting System: </strong>Fans can vote on their favorite AI-generated images. </p>
                        <p><strong>Exclusive Fan Tiers: </strong>Create tiered memberships or subscription levels, where top-tier fans get more frequent opportunities to collaborate or access special features </p>
                        <p><strong>Customizable Fan Avatars: </strong>Allow fans to create or upload custom avatars that are visible during chats and collaborations, enhancing personalization. </p>
                        <p><strong>Competition: </strong>AI ART Competition</p>
                    </> 
                ),
            },

                  
            {
                title: "Thank You",
                content: (
                    <>
                        <h2></h2>
                    </>
                ),
            },
        ];
    
        const nextSlide = () => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        };
    
        const prevSlide = () => {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        };
      return (
        <>
        <header className={styles.header}>
                <div className={styles.header__container}>
                    <div className={styles.slider}>
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
                            >
                                <h3 className={styles.h3}>{slide.title}</h3>
                                <div className={styles.p}>{slide.content}</div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.prev} onClick={prevSlide}>
                        &#10094;
                    </button>
                    <button className={styles.next} onClick={nextSlide}>
                        &#10095;
                    </button>
                </div>
            </header>
        </>
      );
}

export default Presentation;