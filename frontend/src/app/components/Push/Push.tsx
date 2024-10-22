"use client"

import { PushAPI, CONSTANTS, TYPES } from '@pushprotocol/restapi';
import { useWalletClient } from 'wagmi';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';

function Push() {
    
    const { data: walletClient } = useWalletClient()
    const { connector } = useAccount()
    const [data, setData] = useState(CONSTANTS.VIDEO.INITIAL_DATA);

    async function init() {

        if (walletClient) {
            const fan = await PushAPI.initialize(walletClient, { env: CONSTANTS.ENV.STAGING });
            console.log("fan_:", fan);

            const stream = await fan.initStream([CONSTANTS.STREAM.VIDEO]);

            stream.on(CONSTANTS.STREAM.VIDEO, async (data: TYPES.VIDEO.EVENT) => {
                if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
                // handle call request

                console.log("call coming from: ",  data.event);
                }
            
                if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
                // handle call approve
                }
            
                if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
                // handle call denied
                }
            
                if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
                // handle call connected
                }
            
                if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
                // handle call disconnected
                }
            });
            // Connect stream, Important to setup up listen first
            stream.connect();

            console.log("Stream: ", stream);

            // userAlice.video.initialize(onChange, {options?});
            const aliceVideoCall = await fan.video.initialize(setData, {
                stream: stream, // pass the stream object, refer Stream Video
                config: {
                    video: true, // to enable video on start, for frontend use
                    audio: true, // to enable audio on start, for frontend use
                },

               // media?: MediaStream:, // to pass your existing media stream(for backend use)
            });



            await aliceVideoCall.request(["0x7199D548f1B30EA083Fe668202fd5E621241CC89"], {
                rules: {          
                  access: {
                    type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
                    data: {
                        chatId:"0x7199D548f1B30EA083Fe668202fd5E621241CC89"
                    }
                  }
                }
            });
        }
    }
    
    
    return(
        <>
        Push Video
        <button onClick={init}>Signer</button>
        </>
    )
}

export default Push;