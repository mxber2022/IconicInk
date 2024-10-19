import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { createHash } from 'crypto'
import { CreateIpAssetWithPilTermsResponse, IpMetadata, PIL_TYPE, StoryClient, StoryConfig } from '@story-protocol/core-sdk'

async function haha() {

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
        title: "",
        description:"",
        attributes: [{
            key: 'rare',
            value: 'AI'
        }]
    })

    const nftMetadata = {
        name: 'Test NFT',
        description: 'This is a test NFT',
        image: 'https://picsum.photos/200',
    }

    //const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)

    const ipIpfsHash = await fetch('/api/uploadJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsondata: ipMetadata }), // Send base64-encoded blob
    });

    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
   // const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
   const nftIpfsHash = await fetch('/api/uploadJSONToIPFS', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsondata: nftMetadata }), // Send base64-encoded blob
    });
   
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    const response: CreateIpAssetWithPilTermsResponse = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: "0xA004Ff15DF42D71E9611A4cA1b2E078209897144",
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
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
}

export default haha;