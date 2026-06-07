// src/components/EndGame.tsx
interface EndGameProps {
  iWon: boolean;
  winnerName: string;
  winnerColor: string;
  onQuit: () => void;
}

export function EndGame({ iWon, winnerName, winnerColor, onQuit }: EndGameProps) {
  return (
    <div style={{ 
      padding: "30px 15px", 
      fontFamily: "Arial, sans-serif", 
      textAlign: "center", 
      maxWidth: "100vw",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      // 🔥 PRÉMIUM LUDO SÖTÉT HÁTTÉR
      backgroundColor: "#111827",
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(30, 136, 229, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(229, 57, 53, 0.15) 0%, transparent 40%),
        linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02)),
        linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02))
      `,
      backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
      backgroundPosition: "0 0, 0 0, 0 0, 30px 30px"
    }}>
      <div style={{ 
        background: iWon ? "rgba(46, 125, 50, 0.15)" : "rgba(230, 81, 0, 0.15)", 
        border: iWon ? "3px solid #4caf50" : "3px solid #ff9800", 
        backdropFilter: "blur(8px)",
        borderRadius: "24px", 
        padding: "40px 20px", 
        boxShadow: iWon ? "0 0 30px rgba(76,175,80,0.3)" : "0 0 30px rgba(255,152,0,0.3)",
        width: "100%",
        maxWidth: "400px",
        boxSizing: "border-box"
      }}>
        <span style={{ fontSize: "72px", display: "block", marginBottom: "10px" }}>{iWon ? "🏆" : "👑"}</span>
        <h1 style={{ color: iWon ? "#81c784" : "#ffb74d", margin: "10px 0" }}>
          {iWon ? "Congratulations, You Won!" : "Game Over!"}
        </h1>
        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "30px", color: "#e5e7eb" }}>
          The match was won by <span style={{ color: winnerColor === "BLUE" ? "#42a5f5" : "#ff5252" }}>{winnerName}</span>!
        </p>
        <button 
          onClick={onQuit}
          style={{ 
            padding: "14px 28px", 
            fontSize: "16px", 
            fontWeight: "bold", 
            background: iWon ? "#4caf50" : "#ff9800", 
            color: "#fff", 
            border: "none", 
            borderRadius: "12px", 
            width: "100%", 
            cursor: "pointer", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}