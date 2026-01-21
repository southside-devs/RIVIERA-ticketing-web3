import { ethers } from "ethers";
import { getWallet } from "./_walletStore";

const CONTRACT_ADDRESS = "0x63b1C9799ec32F314c07977Df7ebe97ef0016f53";
const ABI = ["function confirmEntry(uint256)"];

export default async function handler(req, res) {
  try {
    const { userId, tokenId } = JSON.parse(req.body);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = getWallet(userId).connect(provider);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
    await contract.confirmEntry(tokenId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
