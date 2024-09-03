//? Components in react are very similar to creating ur own html tag!

import { useConnection, useWallet } from "@solana/wallet-adapter-react"

//! The useWallet `Hook` provides the wallet variable insude the Airdrop `Component`
//* Because I wrapped the Aordrop Component inside the WalletProvider!
export function Airdrop() {
        //*hooks in react!
    const wallet = useWallet();
    const {connection} = useConnection();

        //? Define the function inside the component body!

    async function sendAirdropToUser() {
        const amountInput = document.getElementById("publicKey") as HTMLInputElement;
        const amount = amountInput?.value;
        if (wallet.publicKey && amount) {
            await connection.requestAirdrop(wallet.publicKey, parseFloat(amount) * 1000000000);
            alert("Airdropped Sol!")
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Airdrop SOL</h2>
            <p className="text-sm text-gray-600">
                Connected wallet: {wallet.publicKey?.toString().slice(0, 4)}...{wallet.publicKey?.toString().slice(-4)}
            </p>
            <div className="flex space-x-2">
                <input
                    type="text"
                    id="publicKey"
                    placeholder="Amount"
                    className="flex-grow px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
                <button
                    onClick={sendAirdropToUser}
                    className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Send Airdrop
                </button>
            </div>
        </div>
    )
}