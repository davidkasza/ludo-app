// src/components/GameBoard.tsx
interface GameBoardProps {
  board: any;
  gameData: any;
  user: any;
  localMovingPiece: any;
  myPlayerIndex: number;
  getPlayerIndex: (uid: string) => number;
  onPieceClick: (id: number) => void;
  onRollDice: () => void;
  canRoll: boolean;
  isDiceRolling: boolean;
}

export function GameBoard({
  board, gameData, user, localMovingPiece, myPlayerIndex, getPlayerIndex, onPieceClick,
  onRollDice, canRoll, isDiceRolling
}: GameBoardProps) {
  
  const isMyTurn = gameData?.currentTurn === user?.uid;

  return (
    <div style={{ position: "relative", width: 420, height: 420, border: "3px solid #333", borderRadius: "12px", background: "#fafafa", userSelect: "none" }}>
      {/* BÁZISOK */}
      {board?.p1Base?.map((pos: any, idx: number) => <div key={`p1b-${idx}`} style={{ position: "absolute", left: pos.x, top: pos.y, width: 20, height: 20, background: "rgba(30, 136, 229, 0.15)", border: "1px dashed #1e88e5", borderRadius: "4px" }} />)}
      {board?.p2Base?.map((pos: any, idx: number) => <div key={`p2b-${idx}`} style={{ position: "absolute", left: pos.x, top: pos.y, width: 20, height: 20, background: "rgba(229, 57, 117, 0.15)", border: "1px dashed #e53935", borderRadius: "4px" }} />)}
      
      {/* BEFUTÓK */}
      {board?.p1Home?.map((pos: any, idx: number) => <div key={`p1h-${idx}`} style={{ position: "absolute", left: pos.x, top: pos.y, width: 20, height: 20, borderRadius: "4px", background: idx === 5 ? "#0d47a1" : "#e3f2fd", border: "1px solid #1e88e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#1e88e5", fontWeight: "bold" }}>{idx === 5 ? "👑" : `H${idx}`}</div>)}
      {board?.p2Home?.map((pos: any, idx: number) => <div key={`p2h-${idx}`} style={{ position: "absolute", left: pos.x, top: pos.y, width: 20, height: 20, borderRadius: "4px", background: idx === 5 ? "#b71c1c" : "#ffebee", border: "1px solid #e53935", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#e53935", fontWeight: "bold" }}>{idx === 5 ? "👑" : `H${idx}`}</div>)}

      {/* ÚTVONAL MEZŐK */}
      {board?.positions?.map((pos: any, index: number) => {
        const isP1Start = index === 0; const isP2Start = index === 26;
        const isNeutralSafe = [3, 8, 16, 21, 29, 34, 42, 47].includes(index);
        const displayIndex = myPlayerIndex === 0 ? index : (index + 26) % 52;
        
        let bg = "#fff"; let border = "1px solid #ccc"; let txt = "#999";
        if (isP1Start) { bg = "#90caf9"; border = "2px solid #1e88e5"; txt = "#0d47a1"; }
        else if (isP2Start) { bg = "#ef9a9a"; border = "2px solid #e53935"; txt = "#b71c1c"; }
        else if (isNeutralSafe) { bg = "#fff9c4"; border = "2px solid #fbc02d"; txt = "#f57f17"; }
        
        return (<div key={index} style={{ position: "absolute", left: pos.x, top: pos.y, width: 20, height: 20, borderRadius: "4px", background: bg, border: border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: txt, fontWeight: "bold" }}>{displayIndex}</div>);
      })}

      {/* 👑 KÖZPONTI MEZŐ: INTEGRÁLT INTELIGENS DOBÓKOCKA */}
      <div style={{
        position: "absolute",
        left: 150,
        top: 150,
        width: 120,
        height: 120,
        background: "#ffffff",
        border: "3px solid #444",
        borderRadius: "18px",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        boxSizing: "border-box",
        padding: "6px"
      }}>
        {/* Pörgő vagy fix kocka érték */}
        <div style={{ 
          fontSize: isDiceRolling ? "36px" : "32px", 
          fontWeight: "900", 
          lineHeight: "1",
          marginBottom: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span className={isDiceRolling ? "rolling-dice" : ""} style={{ color: "#4caf50", display: "inline-block" }}>
            {isDiceRolling ? "🌀" : (gameData?.diceValue || "🎲")}
          </span>
        </div>

        {/* Dinamikus Akció gomb / Állapotjelző */}
        {canRoll ? (
          <button 
            onClick={onRollDice} 
            style={{ 
              padding: "5px 12px", 
              fontSize: "12px", 
              fontWeight: "bold", 
              background: "#4caf50", 
              color: "#fff", 
              border: "none", 
              borderRadius: "12px", 
              cursor: "pointer",
              boxShadow: "0 3px 6px rgba(76,175,80,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            Dobás!
          </button>
        ) : (
          <div style={{ 
            fontSize: "10px", 
            fontWeight: "bold", 
            color: isMyTurn ? "#1e88e5" : "#e53935",
            textAlign: "center",
            padding: "2px 4px",
            background: isMyTurn ? "#e3f2fd" : "#ffebee",
            borderRadius: "6px"
          }}>
            {isMyTurn ? "LÉPÉS..." : "VÁRAKOZÁS"}
          </div>
        )}
      </div>

      {/* BÁBÚK RENDERELÉSE */}
      {gameData?.pieces &&
        Object.entries(gameData.pieces).map(([playerId, pieces]: any) => {
          const pIndex = getPlayerIndex(playerId);
          const isP1 = pIndex === 0;
          const color = isP1 ? "#1e88e5" : "#e53935";
          const isCurrentPlayer = playerId === user?.uid;

          return pieces.map((p: any) => {
            let coords = null;
            let isHopping = false;

            if (isCurrentPlayer && localMovingPiece && localMovingPiece.id === p.id) {
              isHopping = true;
              if (localMovingPiece.currentVisualPos === -1) {
                coords = isP1 ? board?.p1Base?.[p.id - 1] : board?.p2Base?.[p.id - 1];
              } else if (localMovingPiece.inHome) {
                coords = isP1 ? board?.p1Home?.[localMovingPiece.currentVisualPos] : board?.p2Home?.[localMovingPiece.currentVisualPos];
              } else {
                coords = board?.positions?.[isP1 ? localMovingPiece.currentVisualPos : (localMovingPiece.currentVisualPos + 26) % 52];
              }
            } else {
              if (p.pos === -1) { coords = isP1 ? board?.p1Base?.[p.id - 1] : board?.p2Base?.[p.id - 1]; }
              else if (p.inHome) { coords = isP1 ? board?.p1Home?.[p.pos] : board?.p2Home?.[p.pos]; }
              else { coords = board?.positions?.[isP1 ? p.pos : (p.pos + 26) % 52]; }
            }

            if (!coords) return null;

            const isAtGoal = p.inHome && p.pos === 5;
            const canClickOnBoard = isCurrentPlayer && isMyTurn && gameData.hasRolled && !isAtGoal && gameData.status === "playing" && !localMovingPiece;

            return (
              <div
                key={`${playerId}-${p.id}`}
                onClick={() => canClickOnBoard && onPieceClick(p.id)}
                className={isHopping ? "hopping-piece" : ""}
                style={{
                  position: "absolute", left: coords.x + 2, top: coords.y - 1, width: 16, height: 20,
                  zIndex: 100 + p.id + (canClickOnBoard ? 20 : 0) + (isAtGoal ? -5 : 0),
                  transition: isHopping ? "none" : "all 0.2s linear", display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: canClickOnBoard ? "pointer" : "default",
                  filter: canClickOnBoard ? "drop-shadow(0px 4px 5px rgba(0,0,0,0.4))" : isAtGoal ? "grayscale(30%) opacity(0.8)" : "none",
                  transform: canClickOnBoard ? "scale(1.15) translateY(-2px)" : "scale(1)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: isAtGoal ? "none" : "inset -2px -2px 3px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.3)", border: canClickOnBoard ? "1px solid #fff" : "none" }} />
                <div style={{ width: 15, height: 10, backgroundColor: color, borderRadius: "50% 50% 2px 2px", marginTop: "-2px", boxShadow: isAtGoal ? "none" : "inset -2px -2px 3px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.4)", borderBottom: isAtGoal ? "none" : "1px solid #fff" }} />
              </div>
            );
          });
        })}
    </div>
  );
}