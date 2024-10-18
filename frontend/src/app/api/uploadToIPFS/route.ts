import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK('5287353c2627f30f6d10', '21d510a30fcfde540ea93b36cd0653798351f252c8169a34452f547bcc405d5f'); // Ensure you set these environment variables

export async function POST(req: NextRequest) {
    try {
        // Extract blob from the request body
        const { blob } = await req.json();

        if (!blob) {    
            return NextResponse.json({ message: 'No blob provided' }, { status: 400 });
        }

        // Convert the base64 blob to a Buffer
        const buffer = Buffer.from(blob, 'base64'); // Ensure this is correct base64-encoded data
        console.log("bufferx ", buffer);
        // Convert Buffer to a readable stream for Pinata
        const readableStream = new Readable();
        readableStream._read = () => {}; // No-op _read method (needed for creating streams manually)
        readableStream.push(buffer);
        readableStream.push(null); // End the stream

        const options = {
            pinataMetadata: {
                name: 'My Awesome Website',
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2',
                },
            },
            pinataOptions: {
                cidVersion: 0,
            },
        };

        // Pin the file to IPFS
        //@ts-ignore
        const result = await pinata.pinFileToIPFS(readableStream, options);

        // Return success response
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return NextResponse.json({ message: 'Error uploading to IPFS', error }, { status: 500 });
    }
}