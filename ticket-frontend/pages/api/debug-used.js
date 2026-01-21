import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x63b1C9799ec32F314c07977Df7ebe97ef0016f53";
const ABI = ["function used(uint256) view returns (bool)"];

export default async function handler(req, res) {
  try {
    const { tokenId } = req.query;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const used = await contract.used(tokenId);
    res.json({ tokenId, used });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
