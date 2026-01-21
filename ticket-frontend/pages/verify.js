import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x63b1C9799ec32F314c07977Df7ebe97ef0016f53";
const ABI = ["function used(uint256) view returns (bool)"];

export default function Verify() {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState("Scan a ticket QR");

  // Start scanner
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        try {
          const url = new URL(decodedText);
          const id = url.searchParams.get("tokenId");

          if (id) {
            setTicketId(id);
            setStatus("⏳ Waiting for user approval...");
            scanner.stop();

            // 🔁 AUTO OPEN USER PAGE
            window.open(`/user-verify?tokenId=${id}`, "_blank");
          }
        } catch {}
      }
    );

    return () => scanner.stop().catch(() => {});
  }, []);

  // Auto poll blockchain
  useEffect(() => {
    if (!ticketId) return;
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [ticketId]);

  async function checkStatus() {
    if (!ticketId) return;

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const used = await contract.used(ticketId);

    if (used) {
      setStatus("❌ Ticket already used");
    } else {
      setStatus("⏳ Waiting for user approval...");
    }
  }

  const isBlocked = status.includes("used");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🚪 Gate Scanner</h2>
        <div id="reader" style={{ width: "100%" }} />
        <p>Ticket ID: {ticketId || "-"}</p>
        <p style={{ marginTop: 10 }}>{status}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000428",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  card: {
    background: "#111",
    padding: "25px",
    borderRadius: "14px",
    width: "360px",
    textAlign: "center",
  },
};
