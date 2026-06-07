// src/components/GameBoard.tsx
interface GameBoardProps {
  board: any;
  gameData: any;
  user: any;
  localMovingPiece: any;
  myPlayerIndex: number;
  getPlayerIndex: (uid: string) => number;
  onPieceClick: (id: number) => void;
}

export function GameBoard({
  board, gameData, user, localMovingPiece, myPlayerIndex, getPlayerIndex, onPieceClick
}: GameBoardProps) {

  const isMyTurn = gameData?.currentTurn === user?.uid;

  // 📐 TISZTA 15x15-ÖS RÁCSRENDSZER
  const cellSize = "calc(100% / 15)";

  // A classicBoard.ts koordinátáit (OFFSET = 20, STEP = 50) tiszta rácsindexekké (0-14) alakítjuk
  const scaleCoord = (val: number) => `calc(((${val} - 20) / 50) * ${cellSize})`;

  // Bábuk méretarányai
  const pieceWidth = `calc(${cellSize} * 0.7)`;
  const pieceHeight = `calc(${cellSize} * 0.9)`;

  // A Ludo King nagy bázisai pontosan 6x6-os mezőnyi területet foglalnak el
  const baseSize = `calc(${cellSize} * 6)`;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      paddingTop: "100%",  // Biztosítja az 1:1 arányú tökéletes négyzetet
      border: "4px solid #333",
      borderRadius: "16px",
      background: "#fafafa",
      userSelect: "none",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
      boxSizing: "border-box"
    }}>
      {/* Abszolút pozicionált belső konténer az elemeknek */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>

        {/* 🟦 LUDO KING KÉK BÁZIS BLOCK (Bal felül: 0,0 indexről indul, 6 mező széles/magas) */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: baseSize,
          height: baseSize,
          background: "#1e88e5",
          borderRight: "1px solid #333",
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          zIndex: 0
        }}>
          {/* Belső fehér tálca a bábuknak */}
          <div style={{ width: "66%", height: "66%", background: "#ffffff", borderRadius: "8px", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15)" }} />
        </div>

        {/* 🟥 LUDO KING PIROS BÁZIS BLOCK (Jobb alul: 9,9 indexről indul, mert 15-6=9, 6 mező széles/magas) */}
        <div style={{
          position: "absolute",
          left: `calc(${cellSize} * 9)`,
          top: `calc(${cellSize} * 9)`,
          width: baseSize,
          height: baseSize,
          background: "#e53935",
          borderLeft: "1px solid #333",
          borderTop: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          zIndex: 0
        }}>
          {/* Belső fehér tálca a bábuknak */}
          <div style={{ width: "66%", height: "66%", background: "#ffffff", borderRadius: "8px", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15)" }} />
        </div>

        {/* BÁZISPONTOK (A bábuk egyedi fészkei a fehér négyzet belsejében széthúzva) */}
        {board?.p1Base?.map((pos: any, idx: number) => (
          <div key={`p1b-${idx}`} style={{ position: "absolute", left: scaleCoord(pos.x), top: scaleCoord(pos.y), width: cellSize, height: cellSize, background: "#ffffff", border: "2px solid #1e88e5", borderRadius: "50%", boxSizing: "border-box", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", zIndex: 1 }} />
        ))}
        {board?.p2Base?.map((pos: any, idx: number) => (
          <div key={`p2b-${idx}`} style={{ position: "absolute", left: scaleCoord(pos.x), top: scaleCoord(pos.y), width: cellSize, height: cellSize, background: "#ffffff", border: "2px solid #e53935", borderRadius: "50%", boxSizing: "border-box", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)", zIndex: 1 }} />
        ))}

        {/* BEFUTÓK (Home sávok) - HAJSZÁLPONTOSAN UGYANOLYAN 1PX-ES SZEGÉLLYEL */}
        {board?.p1Home?.map((pos: any, idx: number) => (
          <div key={`p1h-${idx}`} style={{ position: "absolute", left: scaleCoord(pos.x), top: scaleCoord(pos.y), width: cellSize, height: cellSize, background: idx === 5 ? "#0d47a1" : "#e3f2fd", border: "1px solid #1e88e5", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#1e88e5", fontWeight: "bold", zIndex: 1 }}>
            {idx === 5 ? "👑" : `H${idx}`}
          </div>
        ))}
        {board?.p2Home?.map((pos: any, idx: number) => (
          <div key={`p2h-${idx}`} style={{ position: "absolute", left: scaleCoord(pos.x), top: scaleCoord(pos.y), width: cellSize, height: cellSize, background: idx === 5 ? "#b71c1c" : "#ffebee", border: "1px solid #e53935", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#e53935", fontWeight: "bold", zIndex: 1 }}>
            {idx === 5 ? "👑" : `H${idx}`}
          </div>
        ))}

        {/* ÚTVONAL MEZŐK - MINDEN MEZŐ FIXEN 1PX-ES SZEGÉLLYEL RENDELKEZIK (Nincs méretbeli torzulás!) */}
        {board?.positions?.map((pos: any, index: number) => {
          const isP1Start = index === 0; const isP2Start = index === 26;
          const isNeutralSafe = [3, 8, 16, 21, 29, 34, 42, 47].includes(index);
          const displayIndex = myPlayerIndex === 0 ? index : (index + 26) % 52;

          let bg = "#fff"; let border = "1px solid #ccc"; let txt = "#999";
          if (isP1Start) { bg = "#90caf9"; border = "1px solid #1e88e5"; txt = "#0d47a1"; }
          else if (isP2Start) { bg = "#ef9a9a"; border = "1px solid #e53935"; txt = "#b71c1c"; }
          else if (isNeutralSafe) { bg = "#fff9c4"; border = "1px solid #fbc02d"; txt = "#f57f17"; }

          return (
            <div key={index} style={{ position: "absolute", left: scaleCoord(pos.x), top: scaleCoord(pos.y), width: cellSize, height: cellSize, background: bg, border: border, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: txt, fontWeight: "bold", zIndex: 1 }}>
              {displayIndex}
            </div>
          );
        })}

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

              const pieceLeft = `calc(${scaleCoord(coords.x)} + (${cellSize} - ${pieceWidth}) / 2)`;
              const pieceTop = `calc(${scaleCoord(coords.y)} + (${cellSize} - ${pieceHeight}) / 2)`;

              return (
                <div
                  key={`${playerId}-${p.id}`}
                  onClick={() => canClickOnBoard && onPieceClick(p.id)}
                  className={isHopping ? "hopping-piece" : ""}
                  style={{
                    position: "absolute",
                    left: pieceLeft,
                    top: pieceTop,
                    width: pieceWidth,
                    height: pieceHeight,
                    zIndex: 100 + p.id + (canClickOnBoard ? 20 : 0) + (isAtGoal ? -5 : 0),
                    transition: isHopping ? "none" : "all 0.2s linear",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: canClickOnBoard ? "pointer" : "default",
                    filter: canClickOnBoard ? "drop-shadow(0px 4px 6px rgba(0,0,0,0.4))" : isAtGoal ? "grayscale(30%) opacity(0.8)" : "none",
                    transform: canClickOnBoard ? "scale(1.15) translateY(-4px)" : "scale(1)",
                  }}
                >
                  <div style={{ width: "60%", height: "45%", borderRadius: "50%", background: color, boxShadow: isAtGoal ? "none" : "inset -2px -2px 3px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.3)", border: canClickOnBoard ? "1.5px solid #fff" : "none" }} />
                  <div style={{ width: "95%", height: "55%", backgroundColor: color, borderRadius: "50% 50% 2px 2px", marginTop: "-10%", boxShadow: isAtGoal ? "none" : "inset -2px -2px 3px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.4)", borderBottom: isAtGoal ? "none" : "1.5px solid #fff" }} />
                </div>
              );
            });
          })
        }
      </div>
    </div>
  );
}