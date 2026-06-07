// src/hooks/useLudoGame.ts
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import type { User } from "firebase/auth";

import { classicBoard } from "../boards/classicBoard";
import { testBoard } from "../boards/testBoard";

export function useLudoGame(selectedBoard: string, isTestMode: boolean, cheatDiceValue: number) {
  const [user, setUser] = useState<User | null>(null);
  const [gameId, setGameId] = useState<string>("");
  const [gameData, setGameData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  
  // UI Animációs állapotok
  const [isDiceRolling, setIsDiceRolling] = useState<boolean>(false);
  const [localMovingPiece, setLocalMovingPiece] = useState<any>(null);

  useEffect(() => {
    signInAnonymously(auth)
      .then((res) => setUser(res.user))
      .catch((err) => console.error("Auth error:", err));
  }, []);

  // 🎯 BOARD MAP
  const boards: any = {
    classic: classicBoard,
    test: testBoard
  };

  // 🔥 JAVÍTVA: Itt van a lokális board definíció
  const board = boards[gameData?.boardId || selectedBoard || "classic"];
  const boardSize = board?.positions?.length || 52;

  const getPlayerIndex = (uid: string) => {
    if (!gameData?.players) return 0;
    return gameData.players.indexOf(uid);
  };

  const myPlayerIndex = user ? getPlayerIndex(user.uid) : 0;
  const isMyTurn = gameData?.currentTurn === user?.uid;
  const globalSafePlaces = [0, 3, 8, 16, 21, 26, 29, 34, 42, 47];

  // 🔥 JAVÍTVA: A hiányzó névleolvasó függvény visszakerült a hook törzsébe!
  const getPlayerDisplayTitle = (uid: string) => {
    if (!gameData?.playerNames || !gameData.playerNames[uid]) {
      return getPlayerIndex(uid) === 0 ? "KÉK (P1)" : "PIROS (P2)";
    }
    return gameData.playerNames[uid];
  };

  const listenGame = (id: string) => {
    const ref = doc(db, "games", id);
    onSnapshot(ref, (snap) => {
      setGameData(snap.data());
    });
  };

  const createGame = async (playerName: string) => {
    if (!user || !playerName.trim()) return;
    setStatusMessage("");
    const initialPos = isTestMode ? 49 : -1;

    const docRef = await addDoc(collection(db, "games"), {
      players: [user.uid],
      playerNames: { [user.uid]: playerName.trim() },
      currentTurn: user.uid,
      diceValue: 0,
      hasRolled: false,
      status: "waiting",
      winnerUid: "",     
      boardId: selectedBoard,
      isTestModeActive: isTestMode,
      activeChat: { sender: "", message: "", timestamp: 0 },
      pieces: {
        [user.uid]: [
          { id: 1, pos: initialPos, inHome: false },
          { id: 2, pos: initialPos, inHome: false },
          { id: 3, pos: initialPos, inHome: false },
          { id: 4, pos: initialPos, inHome: false }
        ]
      }
    });

    setGameId(docRef.id);
    listenGame(docRef.id);
  };

  const joinGame = async (playerName: string, inputId: string) => {
    if (!user || !playerName.trim()) return;
    setStatusMessage("");

    const ref = doc(db, "games", inputId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setStatusMessage("❌ A játék nem található!");
      return;
    }

    const data = snap.data();
    if (data.players.length >= 2) {
      setStatusMessage("❌ Ez a játék már megtelt!");
      return;
    }

    const initialPos = data.isTestModeActive ? 49 : -1;

    await updateDoc(ref, {
      players: [...data.players, user.uid],
      playerNames: { ...data.playerNames, [user.uid]: playerName.trim() },
      pieces: {
        ...data.pieces,
        [user.uid]: [
          { id: 1, pos: initialPos, inHome: false },
          { id: 2, pos: initialPos, inHome: false },
          { id: 3, pos: initialPos, inHome: false },
          { id: 4, pos: initialPos, inHome: false }
        ]
      },
      status: "playing" 
    });

    setGameId(inputId);
    listenGame(inputId);
  };

  const rollDice = async () => {
    if (!gameId || !user || !gameData || gameData.currentTurn !== user.uid || gameData.hasRolled || isDiceRolling) return;

    setStatusMessage(""); 
    setIsDiceRolling(true);

    let value = Math.floor(Math.random() * 6) + 1;
    if (gameData.isTestModeActive && cheatDiceValue > 0) {
      value = cheatDiceValue;
    }

    setTimeout(async () => {
      setIsDiceRolling(false);

      const myPieces = gameData.pieces[user.uid] || [];
      const hasValidMove = myPieces.some((p: any) => {
        if (p.pos === 5 && p.inHome) return false; 
        if (p.pos === -1) return value === 6; 
        if (p.inHome) return p.pos + value <= 5; 
        return true; 
      });

      if (!hasValidMove) {
        if (value === 6) {
          setStatusMessage(`🎲 6-ost dobtál, de nincs lépésed! Dobhatsz újra!`);
          await updateDoc(doc(db, "games", gameId), {
            diceValue: value,
            hasRolled: false, 
            currentTurn: user.uid
          });
        } else {
          const nextPlayer = gameData.players.find((p: string) => p !== user.uid) || user.uid;
          setStatusMessage(`🎲 Dobás: ${value}. Nincs szabályos lépésed, a kör átugrott!`);
          await updateDoc(doc(db, "games", gameId), {
            diceValue: value,
            hasRolled: false,
            currentTurn: nextPlayer
          });
        }
      } else {
        await updateDoc(doc(db, "games", gameId), {
          diceValue: value,
          hasRolled: true
        });
      }
    }, 600);
  };

  const movePiece = async (pieceId: number) => {
    if (!gameId || !user || !gameData || gameData.currentTurn !== user.uid || !gameData.hasRolled || localMovingPiece) return;

    const pieces = gameData.pieces[user.uid];
    const targetPiece = pieces.find((p: any) => p.id === pieceId);
    const dice = gameData.diceValue;

    if (targetPiece.pos === 5 && targetPiece.inHome) return;
    if (targetPiece.pos === -1 && dice !== 6) {
      setStatusMessage("⚠️ Onnan csak 6-os dobással jöhetsz ki!");
      return;
    }
    if (targetPiece.inHome && targetPiece.pos + dice > 5) {
      setStatusMessage("⚠️ Túl nagyot dobtál, pontosan a célba kell érned!");
      return;
    }

    setStatusMessage("");

    let remainingSteps = targetPiece.pos === -1 ? 1 : dice;
    let virtualPos = targetPiece.pos;
    let virtualInHome = targetPiece.inHome;

    setLocalMovingPiece({ id: pieceId, currentVisualPos: virtualPos, inHome: virtualInHome, stepCount: remainingSteps });

    const stepInterval = setInterval(async () => {
      remainingSteps--;

      if (virtualPos === -1) {
        virtualPos = 0;
        virtualInHome = false;
      } else if (virtualInHome) {
        virtualPos++;
      } else {
        virtualPos++;
        if (virtualPos > 51) {
          virtualPos = 0;
          virtualInHome = true;
        }
      }

      setLocalMovingPiece({ id: pieceId, currentVisualPos: virtualPos, inHome: virtualInHome, stepCount: remainingSteps });

      if (remainingSteps <= 0) {
        clearInterval(stepInterval);
        setLocalMovingPiece(null); 
        finalizeFirebaseMove(pieceId, virtualPos, virtualInHome, targetPiece);
      }
    }, 250); 
  };

  const finalizeFirebaseMove = async (pieceId: number, finalPos: number, finalInHome: boolean, targetPiece: any) => {
    const pieces = gameData.pieces[user!.uid];
    const dice = gameData.diceValue;

    const updatedPieces = pieces.map((p: any) => {
      if (p.id !== pieceId) return p;
      return { ...p, pos: finalPos, inHome: finalInHome };
    });

    let didCapture = false;
    const opponentUid = gameData.players.find((p: string) => p !== user!.uid);
    let opponentPieces = opponentUid ? gameData.pieces[opponentUid] : null;

    if (opponentPieces && !finalInHome) {
      const myGlobalPos = myPlayerIndex === 0 ? finalPos : (finalPos + 26) % 52;
      const isSafePlace = globalSafePlaces.includes(myGlobalPos);

      if (!isSafePlace) {
        const opponentPlayerIndex = getPlayerIndex(opponentUid!);
        opponentPieces = opponentPieces.map((op: any) => {
          if (op.pos === -1 || op.inHome) return op;
          const opGlobalPos = opponentPlayerIndex === 0 ? op.pos : (op.pos + 26) % 52;
          if (opGlobalPos === myGlobalPos) {
            didCapture = true;
            return { ...op, pos: -1, inHome: false }; 
          }
          return op;
        });
      }
    }

    const isWinner = updatedPieces.every((p: any) => p.inHome && p.pos === 5);
    let nextPlayer = gameData.players.find((p: string) => p !== user!.uid) || user!.uid;
    let bonusRollAvailable = false;

    const didReachGoal = (finalInHome && finalPos === 5) && !(targetPiece.inHome && targetPiece.pos === 5);

    if (dice === 6) {
      nextPlayer = user!.uid; 
      bonusRollAvailable = true;
      setStatusMessage("✨ 6-ost dobtál! Te jössz újra!");
    } else if (didCapture) {
      nextPlayer = user!.uid; 
      bonusRollAvailable = true;
      setStatusMessage("💥 Leütötted az ellenfél bábuját! Bónusz dobás jár!");
    } else if (didReachGoal) {
      nextPlayer = user!.uid;
      bonusRollAvailable = true;
      setStatusMessage("🎉 Bábu a célban! Jutalmad egy extra dobás!");
    }

    const finalAllPieces = { ...gameData.pieces, [user!.uid]: updatedPieces };
    if (opponentUid && opponentPieces) { finalAllPieces[opponentUid] = opponentPieces; }

    await updateDoc(doc(db, "games", gameId), {
      pieces: finalAllPieces,
      currentTurn: isWinner ? user!.uid : nextPlayer,
      hasRolled: false, 
      status: isWinner ? "finished" : "playing",
      winnerUid: isWinner ? user!.uid : ""
    });
  };

  const sendQuickChat = async (msg: string) => {
    if (!gameId) return;
    await updateDoc(doc(db, "games", gameId), {
      activeChat: { sender: user?.uid || "", message: msg, timestamp: Date.now() }
    });
  };

  const teleportPiece = async (pieceId: number, valueStr: string) => {
    if (!gameId || !user || !gameData) return;
    const pieces = gameData.pieces[user.uid];
    let newPos = -1; let newInHome = false;

    if (valueStr === "-1") { newPos = -1; newInHome = false; }
    else if (valueStr.startsWith("H")) { newPos = parseInt(valueStr.replace("H", ""), 10); newInHome = true; }
    else { newPos = parseInt(valueStr, 10); newInHome = false; }

    const updatedPieces = pieces.map((p: any) => {
      if (p.id !== pieceId) return p;
      return { ...p, pos: newPos, inHome: newInHome };
    });

    await updateDoc(doc(db, "games", gameId), { [`pieces.${user.uid}`]: updatedPieces });
  };

  const quitToMenu = () => {
    setGameId("");
    setGameData(null);
    setStatusMessage("");
  };

  return {
    user, gameId, gameData, statusMessage, setStatusMessage,
    isDiceRolling, localMovingPiece, myPlayerIndex, isMyTurn, 
    canRoll: isMyTurn && gameData && !gameData.hasRolled && gameData.status === "playing" && !isDiceRolling,
    createGame, joinGame, rollDice, movePiece, teleportPiece, sendQuickChat, quitToMenu, 
    getPlayerIndex, getPlayerDisplayTitle, globalSafePlaces, 
    board // 🔥 JAVÍTVA: A board-ot is visszaadjuk a hook végén!
  };
}