export const includesAll = (arr: string[] | undefined, target: string[]) => {
  if (!arr) return false;
  return target.every((v) => arr.includes(v));
};
