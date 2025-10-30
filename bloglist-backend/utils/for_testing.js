// 🔹 回文函数
export const palindrome = (string) => string.split('').reverse().join('');

// 🔹 平均值函数
export const average = (array) => {
  if (array.length === 0) return 0;
  return array.reduce((sum, item) => sum + item, 0) / array.length;
};
