# IconicInk

IconicInk is a platform where celebrities or influencers can collaborate with their fans to create AI-generated art. The process is interactive and personalized—both the celebrity and an approved fan can edit the AI prompt together and chat, adding a creative and collaborative touch to the final result. Once the image is generated, the celebrity can digitally(custom) sign it, adding authenticity and mint it as an NFT and transferring ownership to the fan. This platform merges fan engagement with creative co-creation, allowing for unique, signed digital artwork that embodies the collaboration between celebrities and their fans.

## Features
- **Collaborative AI Art Creation**: Celebrities and fans work together in real-time to edit AI-generated art prompts.
- **Real-Time Chat**: Celebrities and fans communicate directly during the creative process, exchanging ideas and refining the prompt.
- **Celebrity Signatures**: Celebrity can sign the art.

## Technology Stack

### Frontend:
- **Next.js**: Framework for server-side rendering and API routes.
- **Socket.io**: Real-time communication for chat and collaborative editing.

### Backend:
- **Node.js**: Server-side JavaScript runtime.
- **Express**: API backend framework.
- **Socket.io (Backend)**: Handles real-time collaboration and chat.
- **Livepeer**: Generates AI-based artwork.
- **Web3.js / Ethers.js**: Blockchain interaction libraries for handling NFT minting, digital signatures, and transfers.
- **IPFS**: Decentralized storage for artwork.


## Installation

### Prerequisites
- **Node.js** (v14.x or later)
- **npm** or **yarn**

### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/mxber2022/iconicink.git
    cd iconicink
    ```

2. Install backend dependencies:
    ```bash
    cd server
    yarn
    ```

3. Run the backend server:
    ```bash
    yarn dev
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install frontend dependencies:
    ```bash
    yarn
    ```

3. Run the frontend:
    ```bash
    yarn dev
    ```

4. Open your browser at:
    ```
    http://localhost:3000
    ```

## License
This project is licensed under the MIT License.

## Contributing
We welcome contributions! Submit a pull request or open an issue if you encounter bugs or have ideas for new features.
