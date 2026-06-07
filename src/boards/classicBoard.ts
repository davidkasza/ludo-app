// boards/classicBoard.ts

const STEP = 25; 
const OFFSET = 20; 

const gridPath = [
  // ÉSZAKI (FELSŐ) ÁG
  { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 },
  // NYUGATI (BAL) ÁG
  { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 6 }, { x: 0, y: 6 },
  { x: 0, y: 7 },
  { x: 0, y: 8 }, { x: 1, y: 8 }, { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 },
  // DÉLI (ALSÓ) ÁG
  { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 },
  { x: 7, y: 14 },
  { x: 8, y: 14 }, { x: 8, y: 13 }, { x: 8, y: 12 }, { x: 8, y: 11 }, { x: 8, y: 10 }, { x: 8, y: 9 },
  // KELETI (JOBB) ÁG
  { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 12, y: 8 }, { x: 13, y: 8 }, { x: 14, y: 8 },
  { x: 14, y: 7 },
  { x: 14, y: 6 }, { x: 13, y: 6 }, { x: 12, y: 6 }, { x: 11, y: 6 }, { x: 10, y: 6 }, { x: 9, y: 6 },
  // ÉSZAKI ÁG VISSZA
  { x: 8, y: 5 }, { x: 8, y: 4 }, { x: 8, y: 3 }, { x: 8, y: 2 }, { x: 8, y: 1 }, { x: 8, y: 0 },
  { x: 7, y: 0 }
];

const player1BaseGrid = [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }]; // Kék bázis
const player2BaseGrid = [{ x: 11, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 12 }]; // Piros bázis

// 🔥 ÚJ: Befutó sávok koordinátái (5 mező + 1 központi célmező)
const p1HomeGrid = [
  { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, // Befutó (index: 0-4)
  { x: 7, y: 6 } // Abszolút CÉL (index: 5)
];

const p2HomeGrid = [
  { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, // Befutó (index: 0-4)
  { x: 7, y: 8 } // Abszolút CÉL (index: 5)
];

export const classicBoard = {
  id: "classic",
  size: 52,
  positions: gridPath.map(pos => ({ x: OFFSET + pos.x * STEP, y: OFFSET + pos.y * STEP })),
  p1Base: player1BaseGrid.map(pos => ({ x: OFFSET + pos.x * STEP, y: OFFSET + pos.y * STEP })),
  p2Base: player2BaseGrid.map(pos => ({ x: OFFSET + pos.x * STEP, y: OFFSET + pos.y * STEP })),
  // Pixel koordináták a befutókhoz
  p1Home: p1HomeGrid.map(pos => ({ x: OFFSET + pos.x * STEP, y: OFFSET + pos.y * STEP })),
  p2Home: p2HomeGrid.map(pos => ({ x: OFFSET + pos.x * STEP, y: OFFSET + pos.y * STEP }))
};