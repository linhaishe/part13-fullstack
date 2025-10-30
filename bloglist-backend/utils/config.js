/* eslint-disable no-undef */
import 'dotenv/config';

let { PORT } = process.env;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { MONGODB_URI, PORT: Number(PORT) || 3001 };
