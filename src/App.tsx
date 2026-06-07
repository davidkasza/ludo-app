// src/App.tsx
import { useState, useEffect } from "react";
import { useLudoGame } from "./hooks/useLudoGame";
import { Lobby } from "./components/Lobby";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { EndGame } from "./components/EndGame";

export default function App() {
  const [playerName, setPlayerName] = useState<string>("David");
  const [selectedBoard, setSelectedBoard] = useState<string>("classic");
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [cheatDiceValue, setCheatDiceValue] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);

  const game = useLudoGame(selectedBoard, isTestMode, cheatDiceValue);

  useEffect(() => {
    if (game.gameData?.activeChat?.message) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [game.gameData?.activeChat?.message, game.gameData?.activeChat?.timestamp]);

  if (game.gameData?.status === "finished") {
    const iWon = game.user ? game.gameData.winnerUid === game.user.uid : false;
    const winnerColor = game.getPlayerIndex(game.gameData.winnerUid) === 0 ? "BLUE" : "RED";
    return (
      <EndGame 
        iWon={iWon} 
        winnerName={game.getPlayerDisplayTitle(game.gameData.winnerUid)} 
        winnerColor={winnerColor} 
        onQuit={game.quitToMenu} 
      />
    );
  }

  if (game.gameData) {
    return (
      <div style={{ 
        padding: "6px 4px", 
        fontFamily: "Arial, sans-serif", 
        color: "#333", 
        minHeight: "100vh", // Kitölti a teljes képernyőmagasságot
        maxWidth: "100vw", 
        margin: "0 auto",
        overflowX: "hidden",
        boxSizing: "border-box",
        // 🔥 LUDO STYLE ABSZTRAKT MINTÁS HÁTTÉR CSS-BŐL GENERÁLVA (Soha nem esik szét, nem foglal memóriát!)
        backgroundColor: "#111827", // Sötét prémium alap tónus
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(30, 136, 229, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(229, 57, 53, 0.15) 0%, transparent 40%),
          linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02)),
          linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02))
        `,
        backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
        backgroundPosition: "0 0, 0 0, 0 0, 30px 30px"
      }}>
        
        <style>{`
          @keyframes diceSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes pulsePanel {
            0% { box-shadow: 0 4px 12px rgba(46,125,50,0.15); }
            50% { box-shadow: 0 4px 20px rgba(46,125,50,0.4); border-color: #4caf50; }
            100% { box-shadow: 0 4px 12px rgba(46,125,50,0.15); }
          }
          .rolling-dice { animation: diceSpin 0.4s linear infinite; }
          .hopping-piece { animation: hop 0.25s ease-in-out infinite; }
          
          /* Kisebb finomítás, hogy a szövegek jól olvashatóak legyenek a sötét háttéren */
          h3 { color: #ffffff !important; }
          .room-info-box { background: rgba(255, 255, 255, 0.08) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1); }
          .room-code-badge { background: rgba(0,0,0,0.3) !important; color: #fff !important; }
        `}</style>

        {showToast && game.gameData.activeChat?.message && (
          <div style={{ 
            position: "fixed", top: "12%", left: "50%", transform: "translateX(-50%)", 
            background: "rgba(0,0,0,0.9)", color: "#fff", padding: "12px 24px", borderRadius: "25px", 
            zIndex: 9999, fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", textAlign: "center", 
            width: "80%", maxWidth: "350px", fontSize: "14px"
          }}>
            💬 {game.getPlayerDisplayTitle(game.gameData.activeChat.sender)}: {game.gameData.activeChat.message}
          </div>
        )}

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>🎲 Ludo Battle {game.gameData.isTestModeActive && <span style={{color: "#f57f17", fontSize: "11px"}}>(Sandbox Mode)</span>}</h3>
          <button onClick={game.quitToMenu} style={{ background: "none", border: "none", color: "#ff5252", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Quit</button>
        </div>

        {/* Játékos infó sáv osztályokkal ellátva a sötét módhoz */}
        <div className="room-info-box" style={{ background: "#f5f5f5", padding: "8px 10px", borderRadius: "8px", fontSize: "12px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Name: <span style={{ color: game.myPlayerIndex === 0 ? "#42a5f5" : "#ff5252", fontWeight: "bold" }}>{game.getPlayerDisplayTitle(game.user?.uid ?? "")}</span></div>
          <div className="room-code-badge" style={{ fontSize: "10px", background: "#fff", padding: "3px 6px", borderRadius: "4px" }}>Room Code: <code>{game.gameId}</code></div>
        </div>

        {game.gameData.status === "waiting" && (
          <div style={{ background: "rgba(255, 248, 225, 0.15)", border: "1px solid #ffe082", padding: "10px", borderRadius: "8px", textAlign: "center", marginBottom: "10px", fontSize: "13px", fontWeight: "bold", color: "#ffe082" }}>
            ⏳ Waiting for opponent...
          </div>
        )}

        {/* 1. QUICK CHAT EMOTES AT THE TOP */}
        <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px", borderRadius: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#aaa", display: "block", marginBottom: "4px" }}>💬 Quick Chat Emotes:</span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {["Sorry! 🙏", "Ouch! 💥", "Love it! ❤️", "Good luck! 🍀", "😂", "😎", "🔥"].map(msg => (
              <button 
                key={msg} 
                onClick={() => game.sendQuickChat(msg)} 
                style={{ 
                  padding: "5px 8px", 
                  fontSize: "12px", 
                  background: "rgba(255,255,255,0.1)", 
                  color: "#ffffff", 
                  border: "1px solid rgba(255,255,255,0.2)", 
                  borderRadius: "6px", 
                  cursor: "pointer", 
                  fontWeight: "bold",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                }}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* 2. THE GAME BOARD IN THE MIDDLE */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          width: "100%",
          maxWidth: "500px", 
          margin: "0 auto 12px",
          touchAction: "manipulation",
          boxSizing: "border-box",
          padding: "0 2px" 
        }}>
          <GameBoard
            board={game.board} 
            gameData={game.gameData} 
            user={game.user} 
            localMovingPiece={game.localMovingPiece}
            myPlayerIndex={game.myPlayerIndex} 
            getPlayerIndex={game.getPlayerIndex} 
            onPieceClick={game.movePiece}
          />
        </div>

        {/* 3. THE GAME CONTROLS AT THE BOTTOM */}
        <div style={{ marginBottom: "10px" }}>
          <GameControls 
            gameData={game.gameData} 
            user={game.user} 
            isMyTurn={game.isMyTurn}
            canRoll={game.canRoll}
            isDiceRolling={game.isDiceRolling}
            cheatDiceValue={cheatDiceValue} 
            setCheatDiceValue={setCheatDiceValue} 
            statusMessage={game.statusMessage}
            onRollDice={game.rollDice}
            onMovePiece={game.movePiece} 
            onTeleportPiece={game.teleportPiece} 
            getPlayerDisplayTitle={game.getPlayerDisplayTitle}
          />
        </div>
      </div>
    );
  }

  return (
    <Lobby
      playerName={playerName} setPlayerName={setPlayerName} selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard}
      isTestMode={isTestMode} setIsTestMode={setIsTestMode} onCreateGame={() => game.createGame(playerName)} onJoinGame={(id) => game.joinGame(playerName, id)}
      statusMessage={game.statusMessage}
    />
  );
}