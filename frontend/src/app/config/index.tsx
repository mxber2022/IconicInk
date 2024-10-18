import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, sepolia, zoraSepolia } from '@reown/appkit/networks'

export const projectId = "9b2fd99411b0746ea4ca219cf395723d"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [zoraSepolia]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig