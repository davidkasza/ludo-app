// src/components/EndGame.tsx
interface EndGameProps {
  iWon: boolean;
  winnerName: string;
  winnerColor: string;
  onQuit: () => void;
}

export function EndGame({ iWon, winnerName, winnerColor, onQuit }: EndGameProps) {
  return (
    <div style={{ padding: "30px 15px", fontFamily: "Arial, sans-serif", textAlign: "center", maxWidth: "450px", margin: "0 auto" }}>
      <div style={{ background: iWon ? "#e8f5e9" : "#fff3e0", border: iWon ? "3px solid #4caf50" : "3px solid #ff9800", borderRadius: "16px", padding: "40px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
        <span style={{ fontSize: "64px" }}>{iWon ? "🏆" : "👑"}</span>
        <h1 style={{ color: iWon ? "#2e7d32" : "#e65100", margin: "20px 0 10px" }}>
          {iWon ? "Gratulálunk, Nyertél!" : "Játék Vége!"}
        </h1>
        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "30px" }}>
          A mérkőzést <span style={{ color: winnerColor === "KÉK" ? "#1e88e5" : "#e53935" }}>{winnerName}</span> nyerte meg!
        </p>
        <button 
          onClick={onQuit}
          style={{ padding: "14px 28px", fontSize: "16px", fontWeight: "bold", background: "#333", color: "#fff", border: "none", borderRadius: "8px", width: "100%", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          Vissza a főmenübe
        </button>
      </div>
    </div>
  );
}