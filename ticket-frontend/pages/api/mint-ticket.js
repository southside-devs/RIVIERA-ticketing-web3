import { ethers } from "ethers";
import { getWallet } from "./_walletStore";

const CONTRACT_ADDRESS = "0x63b1C9799ec32F314c07977Df7ebe97ef0016f53";

const ABI = [
  "function mintTicket(address to)",
  "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)"
];

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { userId } = JSON.parse(req.body);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = getWallet(userId).connect(provider);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    const tx = await contract.mintTicket(wallet.address);
    const receipt = await tx.wait();

    const event = receipt.logs.find(l => l.fragment.name === "Transfer");
    const tokenId = event.args.tokenId.toString();

    res.json({ tokenId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
