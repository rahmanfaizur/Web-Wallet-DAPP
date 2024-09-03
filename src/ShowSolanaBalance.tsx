import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export function ShowSolanaBalance() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState<number | null>(null);

    async function getBalance() {
        if (wallet.publicKey) {
            const fetchedBalance = await connection.getBalance(wallet.publicKey);
            setBalance(fetchedBalance / LAMPORTS_PER_SOL);
        }
    }

    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">SOL Balance</h2>
            <p className="text-xl font-semibold text-gray-700">
                {balance !== null ? `${balance.toFixed(4)} SOL` : 'Not Fetched!'}
            </p>
            <button
                onClick={getBalance}
                className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
                Fetch Updated Balance
            </button>
        </div>
    )
}