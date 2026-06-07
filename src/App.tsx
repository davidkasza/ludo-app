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
    const iWon = game.gameData.winnerUid === game.user?.uid;
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
        padding: "10px 8px", 
        fontFamily: "Arial, sans-serif", 
        color: "#333", 
        maxWidth: "100vw", 
        margin: "0 auto",
        overflowX: "hidden",
        boxSizing: "border-box"
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
          <button onClick={game.quitToMenu} style={{ background: "none", border: "none", color: "#d32f2f", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>Quit</button>
        </div>

        <div style={{ background: "#f5f5f5", padding: "8px 10px", borderRadius: "8px", fontSize: "12px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Your Color: <span style={{ color: game.myPlayerIndex === 0 ? "#1e88e5" : "#e53935", fontWeight: "bold" }}>{game.getPlayerDisplayTitle(game.user?.uid ?? "")}</span></div>
          <div style={{ fontSize: "10px", background: "#fff", padding: "3px 6px", borderRadius: "4px" }}>Room Code: <code>{game.gameId}</code></div>
        </div>

        {game.gameData.status === "waiting" && (
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", padding: "10px", borderRadius: "8px", textAlign: "center", marginBottom: "10px", fontSize: "13px", fontWeight: "bold", color: "#b78103" }}>
            ⏳ Waiting for opponent...
          </div>
        )}

        {/* 1. 🔥 QUICK CHAT EMOTES AT THE TOP */}
        <div style={{ background: "#f9f9f9", border: "1px solid #ddd", padding: "8px", borderRadius: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "4px" }}>💬 Quick Chat Emotes:</span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {["Sorry! 🙏", "Ouch! 💥", "Love it! ❤️", "Good luck! 🍀", "😂", "😎", "🔥"].map(msg => (
              <button 
                key={msg} 
                onClick={() => game.sendQuickChat(msg)} 
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

        {/* 2. 🔥 THE GAME BOARD IN THE MIDDLE */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          width: "100%",
          maxWidth: "450px", 
          margin: "0 auto 14px",
          touchAction: "manipulation",
          boxSizing: "border-box"
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

        {/* 3. 🔥 THE GAME CONTROLS (DICE & PROFILE) AT THE BOTTOM */}
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