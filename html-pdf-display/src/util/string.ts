export const stringToNumber = (str: string) => {
  let n = str.length;
  str.split('').forEach((char) => {
    n += char.charCodeAt(0);
  });
  return n;
};
