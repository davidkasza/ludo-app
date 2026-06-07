// src/App.tsx
import { useState } from "react";
import { useLudoGame } from "./hooks/useLudoGame";
import { Lobby } from "./components/Lobby";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { EndGame } from "./components/EndGame";

export default function App() {
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("classic");
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [cheatDiceValue, setCheatDiceValue] = useState<number>(0);

  // Az összes játéklogika és Firebase szinkronizáció egy helyen
  const game = useLudoGame(selectedBoard, isTestMode, cheatDiceValue);

  // 1️⃣ KÉPERNYŐ: GYŐZELMI INFÓK
  if (game.gameData?.status === "finished") {
    const iWon = game.gameData.winnerUid === game.user?.uid;
    const winnerColor = game.getPlayerIndex(game.gameData.winnerUid) === 0 ? "KÉK" : "PIROS";
    return (
      <EndGame 
        iWon={iWon} 
        winnerName={game.getPlayerDisplayTitle(game.gameData.winnerUid)} 
        winnerColor={winnerColor} 
        onQuit={game.quitToMenu} 
      />
    );
  }

  // 2️⃣ KÉPERNYŐ: GAMEPLAY SCREEN
  if (game.gameData) {
    return (
      <div style={{ padding: "15px", fontFamily: "Arial, sans-serif", color: "#333", maxWidth: "450px", margin: "0 auto" }}>
        
        {/* CSS Keyframes az animációkhoz */}
        <style>{`
          @keyframes diceSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          .rolling-dice { animation: diceSpin 0.4s linear infinite; }
          .hopping-piece { animation: hop 0.25s ease-in-out infinite; }
        `}</style>

        {/* Lebegő nemzetközi chat buborék */}
        {game.gameData.activeChat?.message && (Date.now() - game.gameData.activeChat.timestamp < 4000) && (
          <div style={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.85)", color: "#fff", padding: "10px 20px", borderRadius: "20px", zIndex: 999, fontWeight: "bold" }}>
            💬 {game.getPlayerDisplayTitle(game.gameData.activeChat.sender)}: {game.gameData.activeChat.message}
          </div>
        )}

        {/* Felső sáv */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h3 style={{ margin: 0 }}>🎲 Ludo Csata {game.gameData.isTestModeActive && <span style={{color: "#f57f17", fontSize: "12px"}}>(Teszt Mód)</span>}</h3>
          <button onClick={game.quitToMenu} style={{ background: "none", border: "none", color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}>Kilépés</button>
        </div>

        <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Színed: <span style={{ color: game.myPlayerIndex === 0 ? "#1e88e5" : "#e53935", fontWeight: "bold" }}>{game.getPlayerDisplayTitle(game.user?.uid ?? "")}</span></div>
          <div style={{ fontSize: "11px", background: "#fff", padding: "4px 8px", borderRadius: "4px" }}>Kód: <code>{game.gameId}</code></div>
        </div>

        {/* Várakozási fázis */}
        {game.gameData.status === "waiting" && (
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", padding: "12px", borderRadius: "8px", textAlign: "center", marginBottom: "15px", fontWeight: "bold", color: "#b78103" }}>
            ⏳ Várakozás az ellenfél csatlakozására...
          </div>
        )}

        {/* A JÁTÉKVEZÉRLŐK (Kocka, Gombok, Chat, Csalások) */}
        <div style={{ marginBottom: "20px" }}>
          <GameControls 
            gameData={game.gameData} user={game.user} isMyTurn={game.isMyTurn} canRoll={game.canRoll} isDiceRolling={game.isDiceRolling}
            cheatDiceValue={cheatDiceValue} setCheatDiceValue={setCheatDiceValue} statusMessage={game.statusMessage}
            onRollDice={game.rollDice} onMovePiece={game.movePiece} onTeleportPiece={game.teleportPiece} onSendChat={game.sendQuickChat}
            getPlayerDisplayTitle={game.getPlayerDisplayTitle}
          />
        </div>

        {/* A KIRAJZOLT TÁBLA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GameBoard
            board={game.board} gameData={game.gameData} user={game.user} localMovingPiece={game.localMovingPiece}
            myPlayerIndex={game.myPlayerIndex} getPlayerIndex={game.getPlayerIndex} onPieceClick={game.movePiece}
          />
        </div>
      </div>
    );
  }

  // 3️⃣ KÉPERNYŐ: ALAPÉRTELMEZETT FŐMENÜ / LOBBY
  return (
    <Lobby
      playerName={playerName} setPlayerName={setPlayerName} selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard}
      isTestMode={isTestMode} setIsTestMode={setIsTestMode} onCreateGame={() => game.createGame(playerName)} onJoinGame={(id) => game.joinGame(playerName, id)}
      statusMessage={game.statusMessage}
    />
  );
}