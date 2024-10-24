import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { createHash } from 'crypto'
import { CreateIpAssetWithPilTermsResponse, IpMetadata, PIL_TYPE, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { useState, useEffect } from 'react'
import { approvedWallets } from '@/app/utils/approvedWallets'

async function haha(nftImageLink: String, ) {


        
    const walletsData = await approvedWallets();


    const ipfsPrefix = "https://ipfs.io/ipfs/";
    console.log(`${ipfsPrefix}${nftImageLink}`);
    const privateKey: Address = `0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`
    console.log("privateKey: ",privateKey);
    const account: Account = privateKeyToAccount(privateKey)
    
    const config: StoryConfig = {  
        account: account,  
        transport: http("https://testnet.storyrpc.io"),  
        chainId: 'iliad',  
    }  
    const client = StoryClient.newClient(config)

    const ipMetadata = client.ipAsset.generateIpMetadata({
        title: "AI GENERATED UNIQUE FAN PROMPT",
        description:"",
        attributes: [{
            key: 'AI',
            value: 'YES'
        }]
    })

    const nftMetadata = {
        name: 'AI',
        description: 'AI GENERATED UNIQUE FAN PROMPT',
        image: `${ipfsPrefix}${nftImageLink}`,
    }

    //const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)

    const response1 = await fetch('/api/uploadJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsondata: ipMetadata }), // Send base64-encoded blob
    });


    const responseData = await response1.json();
    const ipIpfsHash = responseData.IpfsHash; // Extract the IpfsHash
    console.log("ipIpfsHash: ", ipIpfsHash);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')

   // const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
   const response2 = await fetch('/api/uploadJSONToIPFS', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsondata: nftMetadata }), // Send base64-encoded blob
    });

    const responseDatax = await response2.json();
    const nftIpfsHash = responseDatax.IpfsHash; // Extract the IpfsHash
    console.log("nftIpfsHash: ", nftIpfsHash);
   
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    const response: CreateIpAssetWithPilTermsResponse = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: "0xA004Ff15DF42D71E9611A4cA1b2E078209897144",
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        recipient: walletsData[0] as Address,
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
    console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`)

    return `https://explorer.story.foundation/ipa/${response.ipId}`
}

export default haha;