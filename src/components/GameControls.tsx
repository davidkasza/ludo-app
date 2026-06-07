// src/components/GameControls.tsx
interface GameControlsProps {
  gameData: any;
  user: any;
  isMyTurn: boolean;
  canRoll: boolean;
  isDiceRolling: boolean;
  cheatDiceValue: number;
  setCheatDiceValue: (val: number) => void;
  statusMessage: string;
  onRollDice: () => void;
  onMovePiece: (id: number) => void;
  onTeleportPiece: (id: number, val: string) => void;
  onSendChat: (msg: string) => void;
  getPlayerDisplayTitle: (uid: string) => string;
}

export function GameControls({
  gameData, user, isMyTurn, canRoll, isDiceRolling, cheatDiceValue, setCheatDiceValue,
  statusMessage, onRollDice, onMovePiece, onTeleportPiece, onSendChat, getPlayerDisplayTitle
}: GameControlsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
      
      {/* KOCKA VEZÉRLŐ */}
      <div style={{ display: "flex", gap: "10px", flexDirection: "column", background: "#e8f5e9", padding: "12px", borderRadius: "8px" }}>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button onClick={onRollDice} disabled={!canRoll} style={{ padding: "12px 20px", fontSize: "16px", fontWeight: "bold", flexGrow: 1, cursor: canRoll ? "pointer" : "not-allowed" }}>
            Dobás
          </button>
          <div style={{ fontSize: "18px", fontWeight: "bold", minWidth: "110px" }}>
            Kocka: <span className={isDiceRolling ? "rolling-dice" : ""} style={{ color: "#4caf50", fontSize: "28px", display: "inline-block" }}>
              {isDiceRolling ? "🌀" : (gameData?.diceValue || "-")}
            </span>
          </div>
        </div>
        
        {/* Cheat kockaválasztó */}
        {gameData.isTestModeActive && isMyTurn && !gameData.hasRolled && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "6px", borderRadius: "6px", border: "1px solid #c8e6c9" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#2e7d32" }}>🔮 Következő dobás:</span>
            <select value={cheatDiceValue} onChange={(e) => setCheatDiceValue(Number(e.target.value))} style={{ padding: "4px", fontWeight: "bold" }}>
              <option value={0}>Véletlen</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Fix {n}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* INFORMÁCIÓS CSÍK */}
      <div style={{ minHeight: "45px", padding: "8px", borderRadius: "6px", background: isMyTurn ? "#e3f2fd" : "#fff5f5", border: isMyTurn ? "1px solid #90caf9" : "1px solid #ffcdd2" }}>
        <div style={{ fontWeight: "bold", fontSize: "14px", color: isMyTurn ? "#1e88e5" : "#e53935" }}>
          {gameData.status === "waiting" ? "Szoba megnyitva, várj a csatlakozóra..." : isMyTurn ? (gameData.hasRolled ? "➡️ Lépj a táblán vagy a gombokkal!" : "🟢 TE JÖSSZ!") : `⏳ Várakozás: ${getPlayerDisplayTitle(gameData.currentTurn)}`}
        </div>
        {statusMessage && <div style={{ color: "#2e7d32", fontSize: "13px", marginTop: "4px", fontWeight: "bold" }}>{statusMessage}</div>}
      </div>

      {/* BÁBÚK LISTÁJA */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {gameData?.pieces?.[user?.uid ?? ""]?.map((p: any) => {
          const isAtGoal = p.inHome && p.pos === 5;
          const canMovePiece = isMyTurn && gameData.hasRolled && !isAtGoal && (p.pos === -1 ? gameData.diceValue === 6 : (!p.inHome || p.pos + gameData.diceValue <= 5));
          const currentSelectValue = p.pos === -1 ? "-1" : p.inHome ? `H${p.pos}` : `${p.pos}`;

          return (
            <div key={p.id} style={{ display: "flex", gap: "8px", alignItems: "center", background: "#fdfdfd", padding: "6px 10px", borderRadius: "8px", border: "1px solid #eee" }}>
              <button onClick={() => onMovePiece(p.id)} disabled={!canMovePiece} style={{ flex: 2, padding: "10px 4px", fontSize: "13px", fontWeight: canMovePiece ? "bold" : "normal", background: isAtGoal ? "#fff9c4" : canMovePiece ? "#c8e6c9" : "#fff", border: canMovePiece ? "2px solid #2e7d32" : "1px solid #ccc", borderRadius: "6px", cursor: canMovePiece ? "pointer" : "not-allowed" }}>
                {p.id}. Bábu ({isAtGoal ? "🏆 CÉL" : p.pos === -1 ? "Bent" : p.inHome ? `Befutó ${p.pos}` : `${p.pos}. mező`})
              </button>
              
              {/* Teleport csalás */}
              {gameData.isTestModeActive && (
                <select value={currentSelectValue} onChange={(e) => onTeleportPiece(p.id, e.target.value)} style={{ padding: "6px", fontSize: "11px", borderRadius: "4px", background: "#fffde7", border: "1px solid #fbc02d" }}>
                  <option value="-1">🏠 Bázis</option>
                  {Array.from({ length: 52 }).map((_, i) => <option key={i} value={`${i}`}>{i}. mező</option>)}
                  {["0","1","2","3","4"].map(n => <option key={n} value={`H${n}`}>H{n}</option>)}
                  <option value="H5">👑 CÉL</option>
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* CHAT PANEL */}
      <div style={{ background: "#f9f9f9", border: "1px solid #ddd", padding: "10px", borderRadius: "10px", marginTop: "5px" }}>
        <span style={{ fontSize: "11px", fontWeight: "bold", color: "#666", display: "block", marginBottom: "6px" }}>💬 Gyors üzenet küldése:</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["Bocsi! 🙏", "Ez fájhatott! 💥", "Szeretlek! ❤️", "Szerencsés vagy!🍀", "😂", "😎", "🔥"].map(msg => (
            <button key={msg} onClick={() => onSendChat(msg)} style={{ padding: "6px 10px", fontSize: "12px", background: "#fff", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>{msg}</button>
          ))}
        </div>
      </div>

    </div>
  );
}