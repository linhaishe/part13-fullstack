import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const PORT = Number(config.PORT) || 3003;

console.log('PORT in config =', config.PORT, typeof config.PORT);
console.log('process.env.PORT =', process.env.PORT);
console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
console.log('process.env.TEST_MONGODB_URI =', process.env.TEST_MONGODB_URI);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

// 以下测试是否能跑通端口
// npm run dev
// curl http://127.0.0.1:3003/ping
// 会输出pong,则表示端口有被监听
// import express from 'express';

// const app = express();

// app.get('/ping', (req, res) => {
//   res.send('pong');
// });

// const PORT = 3003;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
