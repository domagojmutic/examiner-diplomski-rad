export const truncate = function (text: string, maxLength: number) {
  if (!text) return '';
  return (
    text.substring(0, maxLength - 1) + (text.length > maxLength ? '...' : '')
  );
};
