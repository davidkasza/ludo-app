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

  return (
    <div style={{ padding: "30px 20px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #eaeaea", marginTop: "40px" }}>
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <span style={{ fontSize: "50px" }}>🎲</span>
        <h1 style={{ margin: "10px 0 5px", fontSize: "28px" }}>Ludo Multiplayer</h1>
        <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>Classic board game for mobile devices</p>
      </div>

      {statusMessage && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: "8px", fontSize: "13px", textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
          {statusMessage}
        </div>
      )}

      <div style={{ marginBottom: "20px", background: "#f8f9fa", padding: "12px", borderRadius: "10px" }}>
        <h4 style={{ margin: "0 0 8px" }}>1. Enter your nickname:</h4>
        <input placeholder="e.g., David" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={15} style={{ width: "100%", padding: "12px", fontSize: "15px", borderRadius: "8px", border: "2px solid #1e88e5", boxSizing: "border-box", fontWeight: "bold" }} />
      </div>

      <div style={{ marginBottom: "25px" }}>
        <h4 style={{ margin: "0 0 8px", color: "#555" }}>2. Start a new match</h4>
        <div style={{ display: "flex", alignItems: "center", background: "#fffde7", border: "1px dashed #fbc02d", padding: "8px 12px", borderRadius: "8px", marginBottom: "12px" }}>
          <input type="checkbox" id="testModeCheck" checked={isTestMode} onChange={(e) => setIsTestMode(e.target.checked)} style={{ width: "18px", height: "18px", marginRight: "10px" }} />
          <label htmlFor="testModeCheck" style={{ fontSize: "13px", fontWeight: "bold", color: "#f57f17" }}>🛠️ Sandbox Mode (Testing + Cheat tools)</label>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCreateGame} style={{ flex: 2, padding: "12px", fontSize: "15px", fontWeight: "bold", background: "#1e88e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Create Room</button>
          <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
            <option value="classic">Classic Map</option>
            <option value="test">Circular Loop</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", textAlign: "center", color: "#aaa", fontSize: "13px", marginBottom: "25px" }}><hr style={{ flex: 1, border: "none", borderTop: "1px solid #eee" }} /><span style={{ padding: "0 10px" }}>OR</span><hr style={{ flex: 1, border: "none", borderTop: "1px solid #eee" }} /></div>

      <div>
        <h4 style={{ margin: "0 0 8px" }}>3. Join an existing room</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input placeholder="Enter Room Code (Game ID)" value={inputId} onChange={(e) => setInputId(e.target.value)} style={{ padding: "12px", fontSize: "15px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <button onClick={() => onJoinGame(inputId)} style={{ padding: "12px", fontSize: "15px", fontWeight: "bold", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Join Battle</button>
        </div>
      </div>
    </div>
  );
}