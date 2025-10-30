import jwt from 'jsonwebtoken';
import logger from './logger.js';
import User from '../models/user.js';

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    logger.info('get authorization success');
    request.token = authorization.substring(7); // 把 token 存到 request 对象上
  } else {
    request.token = null;
  }
  next();
};

// 假设你已经有 tokenExtractor 中间件了，它把 token 放在 request.token
const userExtractor = async (request, response, next) => {
  const token = request.token;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    // username unique?
    const user = await User.findOne({ username: decodedToken.username });

    request.user = user;
    next();
    logger.info(`userExtractor success:${user}`);
    logger.info('----');
  } catch (error) {
    next(error);
  }
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
