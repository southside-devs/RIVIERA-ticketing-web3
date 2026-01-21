import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [status, setStatus] = useState("");

  async function buyTicket(type) {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contractAddress = "0x7c2Ec964609a7071959309342EFDADa31bE973F1";

      const abi = ["function mintTicket(address to) public"];

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      setStatus(`Minting ${type} ticket...`);

      const tx = await contract.mintTicket(await signer.getAddress());
      await tx.wait();

      setStatus(`🎟️ ${type} Ticket minted successfully!`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🎫 Web3 Ticketing Platform</h1>
      <p style={styles.subtitle}>
        Buy blockchain-powered event tickets with ease
      </p>

      <div style={styles.cardContainer}>
        {/* GOLD TICKET */}
        <div style={{ ...styles.card, ...styles.goldCard }}>
          <h2>Gold Ticket</h2>
          <p>⭐ Premium seating</p>
          <p style={styles.price}>₹2000</p>
          <button
            style={styles.goldButton}
            onClick={() => buyTicket("GOLD")}
          >
            Buy Gold
          </button>
        </div>

        {/* SILVER TICKET */}
        <div style={{ ...styles.card, ...styles.silverCard }}>
          <h2>Silver Ticket</h2>
          <p>🎟️ Standard seating</p>
          <p style={styles.price}>₹1000</p>
          <button
            style={styles.silverButton}
            onClick={() => buyTicket("SILVER")}
          >
            Buy Silver
          </button>
        </div>
      </div>

      {status && <div style={styles.status}>{status}</div>}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: "40px",
  },
  cardContainer: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },
  card: {
    background: "#111",
    borderRadius: "16px",
    padding: "30px",
    width: "260px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    transition: "transform 0.3s",
  },
  goldCard: {
    border: "2px solid gold",
  },
  silverCard: {
    border: "2px solid silver",
  },
  price: {
    fontSize: "22px",
    margin: "15px 0",
  },
  goldButton: {
    background: "linear-gradient(135deg, gold, orange)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  silverButton: {
    background: "linear-gradient(135deg, silver, gray)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  status: {
    marginTop: "30px",
    padding: "15px 25px",
    background: "#000",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(255,255,255,0.2)",
  },
};
