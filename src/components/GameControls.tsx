// src/components/GameControls.tsx
import { useState } from "react";

interface GameControlsProps {
  gameData: any;
  user: any;
  isMyTurn: boolean;
  cheatDiceValue: number;
  setCheatDiceValue: (val: number) => void;
  statusMessage: string;
  onMovePiece: (id: number) => void;
  onTeleportPiece: (id: number, val: string) => void;
  onSendChat: (msg: string) => void;
  getPlayerDisplayTitle: (uid: string) => string;
}

export function GameControls({
  gameData, user, isMyTurn, cheatDiceValue, setCheatDiceValue,
  statusMessage, onMovePiece, onTeleportPiece, onSendChat, getPlayerDisplayTitle
}: GameControlsProps) {
  // Lokális állapot a teszt/cheat üzemmód panel lenyitásához
  const [showCheatPanel, setShowCheatPanel] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      
      {/* INFORMÁCIÓS CSÍK */}
      <div style={{ 
        padding: "8px 12px", 
        borderRadius: "10px",
        background: isMyTurn ? "#e3f2fd" : "#f5f5f5", 
        border: isMyTurn ? "2px solid #1e88e5" : "1px solid #ddd"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "13px", color: isMyTurn ? "#1e88e5" : "#e53935" }}>
          {gameData.status === "waiting" ? "Várakozás a csatlakozóra..." : isMyTurn ? (gameData.hasRolled ? "➡️ Lépj a táblán vagy az alábbi gombokkal!" : "🟢 TE JÖSSZ! Dobj a tábla közepén!") : `⏳ Várakozás: ${getPlayerDisplayTitle(gameData.currentTurn)}`}
        </div>
        {statusMessage && <div style={{ color: "#2e7d32", fontSize: "11px", marginTop: "2px", fontWeight: "bold" }}>{statusMessage}</div>}
      </div>

      {/* BÁBÚK SELEKTORA (VÍZSZINTES MOBILBARÁT KIJELZÉS) */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "4px", margin: "2px 0" }}>
        {gameData?.pieces?.[user?.uid ?? ""]?.map((p: any) => {
          const isAtGoal = p.inHome && p.pos === 5;
          const canMovePiece = isMyTurn && gameData.hasRolled && !isAtGoal && (p.pos === -1 ? gameData.diceValue === 6 : (!p.inHome || p.pos + gameData.diceValue <= 5));

          return (
            <button 
              key={p.id}
              onClick={() => onMovePiece(p.id)} 
              disabled={!canMovePiece} 
              style={{ 
                flex: 1, 
                padding: "8px 2px", 
                fontSize: "11px", 
                fontWeight: "bold", 
                background: isAtGoal ? "#fff9c4" : canMovePiece ? "#c8e6c9" : "#fff", 
                border: canMovePiece ? "2px solid #2e7d32" : "1px solid #ddd", 
                borderRadius: "8px", 
                color: "#222222",
                cursor: canMovePiece ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                boxShadow: canMovePiece ? "0 2px 6px rgba(46,125,50,0.2)" : "none"
              }}
            >
              <span style={{ fontSize: "10px", opacity: 0.7 }}>#{p.id} Bábu</span>
              <span style={{ fontSize: "11px" }}>
                {isAtGoal ? "🏆" : p.pos === -1 ? "🏠" : p.inHome ? `B${p.pos}` : `${p.pos}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* CHEAT PANEL ELREJTVE (Csak ha aktív a teszt mód) */}
      {gameData.isTestModeActive && (
        <div style={{ background: "#fffde7", border: "1px solid #fbc02d", borderRadius: "8px", padding: "4px 8px" }}>
          <button 
            onClick={() => setShowCheatPanel(!showCheatPanel)} 
            style={{ width: "100%", background: "none", border: "none", color: "#f57f17", fontWeight: "bold", fontSize: "11px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}
          >
            <span>{showCheatPanel ? "▲ Csalások és Teleport elrejtése" : "▼ Csalások és Teleport megnyitása"}</span>
          </button>
          
          {showCheatPanel && (
            <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "4px" }}>
              {/* Cheat kockaválasztó */}
              {isMyTurn && !gameData.hasRolled && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "4px", borderRadius: "4px", border: "1px solid #ffe082" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#b78103" }}>🔮 Következő dobás:</span>
                  <select value={cheatDiceValue} onChange={(e) => setCheatDiceValue(Number(e.target.value))} style={{ padding: "2px", fontSize: "11px", fontWeight: "bold" }}>
                    <option value={0}>Véletlen</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Fix {n}</option>)}
                  </select>
                </div>
              )}
              {/* Teleport gombok a bábukhoz */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
                {gameData?.pieces?.[user?.uid ?? ""]?.map((p: any) => {
                  const currentSelectValue = p.pos === -1 ? "-1" : p.inHome ? `H${p.pos}` : `${p.pos}`;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "2px 4px", borderRadius: "4px", border: "1px solid #ffe082" }}>
                      <span style={{ fontSize: "10px" }}>#{p.id}:</span>
                      <select value={currentSelectValue} onChange={(e) => onTeleportPiece(p.id, e.target.value)} style={{ padding: "2px", fontSize: "10px", background: "#fff" }}>
                        <option value="-1">Bázis</option>
                        {Array.from({ length: 52 }).map((_, i) => <option key={i} value={`${i}`}>{i}. m</option>)}
                        {["0","1","2","3","4"].map(n => <option key={n} value={`H${n}`}>H{n}</option>)}
                        <option value="H5">👑 CÉL</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHAT PANEL */}
      <div style={{ background: "#f9f9f9", border: "1px solid #ddd", padding: "8px", borderRadius: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "4px" }}>💬 Gyors üzenet küldése:</span>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {["Bocsi! 🙏", "Ez fájhatott! 💥", "Szeretlek! ❤️", "Szerencse! 🍀", "😂", "😎", "🔥"].map(msg => (
            <button 
              key={msg} 
              onClick={() => onSendChat(msg)} 
              style={{ 
                padding: "5px 8px", 
                fontSize: "12px", 
                background: "#ffffff", 
                color: "#222222", 
                border: "1px solid #ccc", 
                borderRadius: "6px", 
                cursor: "pointer", 
                fontWeight: "bold",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}