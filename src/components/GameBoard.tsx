// src/components/GameBoard.tsx
import { useEffect, useRef } from "react";

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
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickAreasRef = useRef<Array<{ id: number; x: number; y: number; r: number }>>([]);
  
  const stateRef = useRef({ board, gameData, user, localMovingPiece, myPlayerIndex });
  
  useEffect(() => {
    stateRef.current = { board, gameData, user, localMovingPiece, myPlayerIndex };
  }, [board, gameData, user, localMovingPiece, myPlayerIndex]);

  const isMyTurn = gameData?.currentTurn === user?.uid;

  // 📐 A Canvas belső, fix logikai felbontása
  const BASE_RESOLUTION = 600;
  const gridCount = 15;
  const cellSize = BASE_RESOLUTION / gridCount; // 40px cellánként

  const getGridIndex = (val: number) => Math.round((val - 20) / 50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let hopFrame = 0; 

    const renderLoop = () => {
      hopFrame += 0.2; 

      const current = stateRef.current;
      const currentBoard = current.board;
      const currentGameData = current.gameData;
      const currentUser = current.user;
      const currentLocalMovingPiece = current.localMovingPiece;

      // 🔥 TRÜKK: Nem fillRect-el színezzük fehérre az alap háttért, hanem CLEAR-eljük!
      // Ezáltal a teljes vászon láthatatlan/átlátszó lesz, ahol nem rajzolunk rá külön mezőt.
      ctx.clearRect(0, 0, BASE_RESOLUTION, BASE_RESOLUTION);

      // --- 1. NAGY BÁZISOK RAJZOLÁSA ---
      const basePxSize = cellSize * 6;

      // 🟦 Kék bázis (Bal felül)
      ctx.fillStyle = "#1e88e5";
      ctx.fillRect(0, 0, basePxSize, basePxSize);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; // Finomabb fehér szegély a sötét háttérhez
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, basePxSize, basePxSize);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(basePxSize * 0.15, basePxSize * 0.15, basePxSize * 0.70, basePxSize * 0.70, 12);
      ctx.fill();

      // 🟥 Piros bázis (Jobb alul)
      const redBaseX = cellSize * 9;
      const redBaseY = cellSize * 9;
      ctx.fillStyle = "#e53935";
      ctx.fillRect(redBaseX, redBaseY, basePxSize, basePxSize);
      ctx.strokeRect(redBaseX, redBaseY, basePxSize, basePxSize);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(redBaseX + basePxSize * 0.15, redBaseY + basePxSize * 0.15, basePxSize * 0.70, basePxSize * 0.70, 12);
      ctx.fill();

      // --- 2. BÁZISPONTOK (Fehér fészkek) ---
      const drawBaseNest = (pos: any, color: string) => {
        const gx = getGridIndex(pos.x);
        const gy = getGridIndex(pos.y);
        const cx = gx * cellSize + cellSize / 2;
        const cy = gy * cellSize + cellSize / 2;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, cellSize * 0.38, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      currentBoard?.p1Base?.forEach((pos: any) => drawBaseNest(pos, "#1e88e5"));
      currentBoard?.p2Base?.forEach((pos: any) => drawBaseNest(pos, "#e53935"));

      // --- 3. HOME SÁVOK (A tiszta színes folyosók) ---
      const drawHomeTile = (pos: any, idx: number, mainColor: string) => {
        const gx = getGridIndex(pos.x);
        const gy = getGridIndex(pos.y);
        const tx = gx * cellSize;
        const ty = gy * cellSize;

        if (idx === 5) return; 

        ctx.fillStyle = mainColor;
        ctx.fillRect(tx, ty, cellSize, cellSize);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(tx, ty, cellSize, cellSize);
      };
      currentBoard?.p1Home?.forEach((pos: any, idx: number) => drawHomeTile(pos, idx, "#1e88e5"));
      currentBoard?.p2Home?.forEach((pos: any, idx: number) => drawHomeTile(pos, idx, "#e53935"));

      // --- 4. ÚTVONAL MEZŐK (Maradnak fehérek, így tökéletesen látszódnak!) ---
      currentBoard?.positions?.forEach((pos: any, index: number) => {
        const gx = getGridIndex(pos.x);
        const gy = getGridIndex(pos.y);
        const tx = gx * cellSize;
        const ty = gy * cellSize;
        
        const isP1Start = index === 0;
        const isP2Start = index === 26;
        const isNeutralSafe = [3, 8, 16, 21, 29, 34, 42, 47].includes(index);

        let bg = "#ffffff"; 
        let border = "rgba(0, 0, 0, 0.15)"; // Sötét háttér mellett a finom fekete szegély mutat a legjobban

        if (isP1Start) { bg = "#29b6f6"; border = "#1e88e5"; } // Kicsit élénkebb kék a sötét témához
        else if (isP2Start) { bg = "#ef5350"; border = "#e53935"; } // Kicsit élénkebb piros
        else if (isNeutralSafe) { bg = "#fff59d"; border = "#fbc02d"; }

        ctx.fillStyle = bg;
        ctx.fillRect(tx, ty, cellSize, cellSize);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(tx, ty, cellSize, cellSize);

        if (isNeutralSafe) {
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#f57f17";
          ctx.fillText("⭐", tx + cellSize / 2, ty + cellSize / 2);
        }
      });

      // --- 5. KÉTSZEMÉLYES KÖZÉPSŐ HÁROMSZÖGEK ---
      const midStart = cellSize * 6;
      const midEnd = cellSize * 9;
      const centerPt = BASE_RESOLUTION / 2;

      // 🟦 KÉK KÖZÉPSŐ HÁROMSZÖG (Fentről lefelé)
      ctx.fillStyle = "#1e88e5";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midStart, midStart);
      ctx.lineTo(centerPt, centerPt);
      ctx.lineTo(midEnd, midStart);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 🟥 PIROS KÖZÉPSŐ HÁROMSZÖG (Lentről felfelé)
      ctx.fillStyle = "#e53935";
      ctx.beginPath();
      ctx.moveTo(midStart, midEnd);
      ctx.lineTo(centerPt, centerPt);
      ctx.lineTo(midEnd, midEnd);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Koronák
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("👑", centerPt, midStart + cellSize * 0.5); 
      ctx.fillText("👑", centerPt, midEnd - cellSize * 0.5);  

      // --- 6. BÁBÚK ÉS INTERAKTÍV KATTINTÁSI ZÓNÁK ---
      const clickableTargets: Array<{ id: number; x: number; y: number; r: number }> = [];

      if (currentGameData?.pieces) {
        Object.entries(currentGameData.pieces).forEach(([playerId, pieces]: any) => {
          const pIndex = getPlayerIndex(playerId);
          const isP1 = pIndex === 0;
          const isCurrentPlayer = playerId === currentUser?.uid;

          const colorBright = isP1 ? "#42a5f5" : "#ef5350";
          const colorDark = isP1 ? "#1565c0" : "#c62828";

          pieces.forEach((p: any) => {
            let coords = null;
            let isCurrentlyMoving = false;

            if (isCurrentPlayer && currentLocalMovingPiece && currentLocalMovingPiece.id === p.id) {
              isCurrentlyMoving = true;
              if (currentLocalMovingPiece.currentVisualPos === -1) {
                coords = isP1 ? currentBoard?.p1Base?.[p.id - 1] : currentBoard?.p2Base?.[p.id - 1];
              } else if (currentLocalMovingPiece.inHome) {
                coords = isP1 ? currentBoard?.p1Home?.[currentLocalMovingPiece.currentVisualPos] : currentBoard?.p2Home?.[currentLocalMovingPiece.currentVisualPos];
              } else {
                coords = currentBoard?.positions?.[isP1 ? currentLocalMovingPiece.currentVisualPos : (currentLocalMovingPiece.currentVisualPos + 26) % 52];
              }
            } else {
              if (p.pos === -1) { 
                coords = isP1 ? currentBoard?.p1Base?.[p.id - 1] : currentBoard?.p2Base?.[p.id - 1]; 
              } else if (p.inHome) { 
                coords = isP1 ? currentBoard?.p1Home?.[p.pos] : currentBoard?.p2Home?.[p.pos]; 
              } else { 
                coords = currentBoard?.positions?.[isP1 ? p.pos : (p.pos + 26) % 52]; 
              }
            }

            if (!coords) return;

            const gx = getGridIndex(coords.x);
            const gy = getGridIndex(coords.y);
            
            let cx = gx * cellSize + cellSize / 2;
            let cy = gy * cellSize + cellSize / 2;

            if (p.inHome && p.pos === 5) {
              cx = centerPt;
              cy = isP1 ? midStart + cellSize * 0.5 : midEnd - cellSize * 0.5;
            }

            if (isCurrentlyMoving) {
              const hopYOffset = Math.abs(Math.sin(hopFrame)) * (cellSize * 0.45);
              cy -= hopYOffset;
            }

            const isAtGoal = p.inHome && p.pos === 5;
            const canClickOnBoard = isCurrentPlayer && isMyTurn && currentGameData.hasRolled && !isAtGoal && currentGameData.status === "playing" && !currentLocalMovingPiece;

            if (canClickOnBoard) {
              clickableTargets.push({ id: p.id, x: cx, y: cy, r: cellSize * 0.55 });
            }

            ctx.save();
            if (isAtGoal) ctx.globalAlpha = 0.5;

            ctx.shadowColor = "rgba(0, 0, 0, 0.6)"; // Sötétebb, kontrasztosabb árnyék
            ctx.shadowBlur = canClickOnBoard ? 12 : 6;
            ctx.shadowOffsetY = canClickOnBoard ? 7 : 3;

            // 1. 3D Szoknya / Test
            const bodyGradient = ctx.createRadialGradient(cx - 3, cy + cellSize * 0.1, 2, cx, cy + cellSize * 0.15, cellSize * 0.35);
            bodyGradient.addColorStop(0, colorBright);
            bodyGradient.addColorStop(1, colorDark);
            
            ctx.fillStyle = bodyGradient;
            ctx.beginPath();
            ctx.ellipse(cx, cy + cellSize * 0.15, cellSize * 0.36, cellSize * 0.24, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = canClickOnBoard ? "#ffffff" : "rgba(255,255,255,0.7)";
            ctx.lineWidth = canClickOnBoard ? 2 : 1;
            ctx.stroke();

            // 2. 3D Fej
            const headGradient = ctx.createRadialGradient(cx - 3, cy - cellSize * 0.2, 1, cx, cy - cellSize * 0.18, cellSize * 0.22);
            headGradient.addColorStop(0, colorBright);
            headGradient.addColorStop(1, colorDark);

            ctx.fillStyle = headGradient;
            ctx.beginPath();
            ctx.arc(cx, cy - cellSize * 0.18, cellSize * 0.21, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.restore();
          });
        });
      }

      clickAreasRef.current = clickableTargets;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [cellSize, isMyTurn]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const canvasX = (clientX / rect.width) * BASE_RESOLUTION;
    const canvasY = (clientY / rect.height) * BASE_RESOLUTION;

    const hitTarget = clickAreasRef.current.find(target => {
      const distance = Math.sqrt((canvasX - target.x) ** 2 + (canvasY - target.y) ** 2);
      return distance <= target.r;
    });

    if (hitTarget) {
      onPieceClick(hitTarget.id);
    }
  };

  return (
    <div style={{ 
      position: "relative", 
      width: "100%",       
      paddingTop: "100%",  
      border: "5px solid #2d3748", 
      borderRadius: "20px", 
      // 🔥 FIX: Kivettem a teli fehér hátteret a divből, így átlátszó lesz, ahol a Canvas nem rajzol semmit!
      background: "transparent", 
      userSelect: "none",
      boxShadow: "0 12px 35px rgba(0,0,0,0.5)",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      <canvas
        ref={canvasRef}
        width={BASE_RESOLUTION}
        height={BASE_RESOLUTION}
        onClick={handleCanvasClick}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />
    </div>
  );
}