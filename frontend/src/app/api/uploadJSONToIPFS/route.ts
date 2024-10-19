import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK('5287353c2627f30f6d10', '21d510a30fcfde540ea93b36cd0653798351f252c8169a34452f547bcc405d5f'); // Ensure you set these environment variables

export async function POST(req: NextRequest) {
    try {
    
        const { jsondata } = await req.json();
        console.log("jsondata: ", jsondata);
  

        const result = await pinata.pinJSONToIPFS(jsondata);

        // Return success response
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error uploading to JSON IPFS:', error);
        return NextResponse.json({ message: 'Error uploading JSON to IPFS', error }, { status: 500 });
    }
}