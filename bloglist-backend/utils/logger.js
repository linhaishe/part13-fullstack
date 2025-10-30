/* eslint-disable no-undef */
import 'dotenv/config';

// 普通日志（测试环境下不输出）
const info = (...params) => {
  // if (process.env.NODE_ENV !== 'test') {
  //   console.log(...params);
  // }
  console.log(...params);
};

// 错误日志（总是输出）
const error = (...params) => {
  // if (process.env.NODE_ENV !== 'test') {
  //   console.error(...params);
  // }
  console.error(...params);
};

export default { info, error };
