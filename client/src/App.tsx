import axios from 'axios';
import './App.css';
import { Transaction, Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(`https://solana-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_API_KEY}`);
const fromPubkey = new PublicKey(import.meta.env.VITE_PUBLIC_ADDRESS);

function App() {
    async function sendSol() {
        const ix = SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: new PublicKey(import.meta.env.VITE_PUBLIC_ADDRESS),
            lamports: 0.01 * LAMPORTS_PER_SOL
        });
        const tx = new Transaction().add(ix);
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = fromPubkey;

        const serializedTx = tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false
        });

        console.log(serializedTx);

        await axios.post("http://localhost:3000/api/txn/sign", {
            message: serializedTx,
            retry: false
        });
    }


    return <div>
        <input type="text" placeholder="Amount"></input>
        <input type="text" placeholder="Address"></input>
        <button onClick={sendSol}>Submit</button>
    </div>;
}

export default App;