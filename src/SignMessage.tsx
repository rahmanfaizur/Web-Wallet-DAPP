import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');

    async function handleSign() {
        try {
            setError('');
            setSignature('');

            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            const encodedMessage = new TextEncoder().encode(message);
            const signatureBytes = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signatureBytes);

            if (!ed25519.verify(signatureBytes, encodedMessage, publicKey.toBytes())) {
                throw new Error('Message Signature Invalid!');
            }

            setSignature(signatureBase58);
        } catch (err) {
            setError(err.message);
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Sign Message</h2>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Enter message to sign" 
                className="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
            <button
                onClick={handleSign}
                className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
                Sign Message
            </button>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            {signature && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
                    <h3 className="text-base font-semibold text-gray-800">Signed Message:</h3>
                    <p className="mt-2"><span className="font-semibold">Message:</span> {message}</p>
                    <div className="mt-2">
                        <span className="font-semibold">Signature:</span>
                        <div className="flex items-center mt-1">
                            <div className="flex-1 bg-white px-2 py-1 rounded border border-gray-300 overflow-hidden text-ellipsis">
                                {signature.slice(0, 15)}...{signature.slice(-15)}
                            </div>
                            <button
                                onClick={() => copyToClipboard(signature)}
                                className="ml-2 px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function VerifySignature() {
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [publicKeyString, setPublicKeyString] = useState('');
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

    function handleVerify() {
        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signatureBytes = bs58.decode(signature);
            const publicKeyBytes = bs58.decode(publicKeyString);

            const isValid = ed25519.verify(signatureBytes, encodedMessage, publicKeyBytes);
            setVerificationResult(isValid);
        } catch (err) {
            setVerificationResult(false);
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-4 mt-8">
            <h2 className="text-xl font-bold text-gray-800">Verify Signature</h2>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Enter original message" 
                className="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
            <input 
                type="text" 
                value={signature} 
                onChange={(e) => setSignature(e.target.value)} 
                placeholder="Enter signature (base58)" 
                className="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
            <input 
                type="text" 
                value={publicKeyString} 
                onChange={(e) => setPublicKeyString(e.target.value)} 
                placeholder="Enter public key (base58)" 
                className="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
            <button
                onClick={handleVerify}
                className="w-full px-4 py-2 text-sm text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
                Verify Signature
            </button>
            
            {verificationResult !== null && (
                <p className={`text-center text-sm font-semibold ${verificationResult ? 'text-green-500' : 'text-red-500'}`}>
                    Signature is {verificationResult ? 'valid' : 'invalid'}
                </p>
            )}
        </div>
    );
}