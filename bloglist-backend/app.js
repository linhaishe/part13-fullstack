import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import config from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';
import blogListsRouter from './controllers/bloglists.js';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import testingRouter from './controllers/testing.js';
import mongoose from 'mongoose';

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB success!');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

//使用中间件并允许来自所有来源的请求
app.use(cors());
//在 Express 中提供静态文件,访问图像和级联样式表 (CSS) 等静态资源
app.use(express.static('build'));
//请求主体 (express.json()) 中的 JSON 对象
app.use(express.json());
//app.use(handler),For a custom handler
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
// router文件 里不要再写 /api/blogs 前缀，挂载到 app.js 的时候已经加了
//open http://localhost:3001/api/blogs

// use the middleware only in /api/blogs routes
// app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// use the middleware in all routes
app.use(middleware.userExtractor);

app.use('/api/blogs', blogListsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
