// Stable colour per title, used for the cover placeholder and card edge
export const spine = (title) => {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 45% 42%)`;
};
