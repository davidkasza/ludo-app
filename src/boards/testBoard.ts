export const testBoard = {
  id: "test",
  size: 52,

  positions: Array.from({ length: 52 }).map((_, i) => {
    // ideiglenes kör layout, de már NEM App.tsx-ben van
    const angle = (i / 52) * 2 * Math.PI;
    const radius = 120;

    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle)
    };
  })
};