// src/components/Lobby.tsx
import { useState } from "react";

interface LobbyProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
  isTestMode: boolean;
  setIsTestMode: (mode: boolean) => void;
  onCreateGame: () => void;
  onJoinGame: (id: string) => void;
  statusMessage: string;
}

export function Lobby({
  playerName, setPlayerName, selectedBoard, setSelectedBoard,
  isTestMode, setIsTestMode, onCreateGame, onJoinGame, statusMessage
}: LobbyProps) {
  const [inputId, setInputId] = useState("");

  const handleCreateRoom = () => {
    onCreateGame();
  };

  const handleJoinGame = () => {
    onJoinGame(inputId);
  };

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBoard(e.target.value);
  };

  return (
    <div style={{
      padding: "40px 16px 20px",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      maxWidth: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
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
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255, 255, 255, 0.04)",
        borderRadius: "24px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "30px 20px",
        boxSizing: "border-box",
        position: "relative"
      }}>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <span style={{ fontSize: "56px", display: "block", lineHeight: "1", marginBottom: "14px" }}>🎲</span>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "28px", color: "#ffffff", fontWeight: "900" }}>Ludo Multiplayer</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Classic board game for mobile devices</p>
        </div>

        {statusMessage && (
          <div style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "12px", borderRadius: "10px", fontSize: "13px", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
            ⚠️ {statusMessage}
          </div>
        )}

        {/* 1. Szekció */}
        <div style={{ marginBottom: "20px", background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ margin: "0 0 10px", color: "#e5e7eb" }}>1. Enter your nickname:</h4>
          <input
            placeholder="e.g., David"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={15}
            style={{ width: "100%", padding: "12px", fontSize: "15px", borderRadius: "10px", border: "2px solid #1e88e5", background: "rgba(0,0,0,0.2)", color: "#fff", boxSizing: "border-box", fontWeight: "bold", outline: "none" }}
          />
        </div>

        {/* 2. Szekció */}
        <div style={{ marginBottom: "25px", background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ margin: "0 0 10px", color: "#e5e7eb" }}>2. Start a new match:</h4>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(245, 127, 23, 0.1)", border: "1px dashed rgba(251, 192, 45, 0.4)", padding: "10px 12px", borderRadius: "10px", marginBottom: "14px" }}>
            <input type="checkbox" id="testModeCheck" checked={isTestMode} onChange={(e) => setIsTestMode(e.target.checked)} style={{ width: "18px", height: "18px", marginRight: "10px", cursor: "pointer" }} />
            <label htmlFor="testModeCheck" style={{ fontSize: "13px", fontWeight: "bold", color: "#ffe082", cursor: "pointer" }}>🛠️ Sandbox Mode (Cheats Enabled)</label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleCreateRoom} style={{ flex: 2, padding: "12px", fontSize: "15px", fontWeight: "bold", background: "#1e88e5", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 4px 10px rgba(30,136,229,0.3)" }}>Create Room</button>
            <select value={selectedBoard} onChange={handleBoardChange} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", background: "#1f2937", color: "#fff", outline: "none", fontSize: "13px", fontWeight: "bold" }}>
              <option value="classic">Classic Map</option>
              <option value="test">Circular Loop</option>
            </select>
          </div>
        </div>

        {/* Elválasztó vonal */}
        <div style={{ display: "flex", alignItems: "center", textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "25px" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
          <span style={{ padding: "0 10px", fontWeight: "bold" }}>OR</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
        </div>

        {/* 3. Szekció */}
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ margin: "0 0 10px", color: "#e5e7eb" }}>3. Join an existing room:</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              placeholder="Enter Room Code"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              style={{ padding: "12px", fontSize: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", boxSizing: "border-box", textAlign: "center", letterSpacing: "1px", outline: "none" }}
            />
            <button onClick={handleJoinGame} style={{ padding: "12px", fontSize: "15px", fontWeight: "bold", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 4px 10px rgba(46,125,50,0.3)" }}>Join Battle</button>
          </div>
        </div>
      </div>
    </div>
  );
}