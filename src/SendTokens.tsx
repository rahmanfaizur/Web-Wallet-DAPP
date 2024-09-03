import { useState, useEffect } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

// Polyfill for Buffer
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Ensure Buffer is available
        if (typeof window !== 'undefined' && !window.Buffer) {
            window.Buffer = Buffer;
        }
    }, []);

    async function sendTokens() {
        setStatus('');
        if (!wallet.publicKey || !wallet.signTransaction) {
            setStatus('Wallet not connected!');
            return;
        }
        try {
            const toPublicKey = new PublicKey(to);
            const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: toPublicKey,
                    lamports,
                })
            );
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;
            
            const signed = await wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signed.serialize());
            await connection.confirmTransaction(signature, 'confirmed');
            setStatus(`Sent ${amount} SOL to ${to}. Signature: ${signature}`);
            setTo('');
            setAmount('');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Send SOL</h2>
            <input
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="To Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            <input
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="Amount (SOL)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button
                className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={sendTokens}
                disabled={!wallet.connected}
            >
                Send
            </button>
            {status && (
                <div className={`mt-4 p-4 rounded-md ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {status}
                </div>
            )}
        </div>
    );
}