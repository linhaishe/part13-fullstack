import BlogList from '../models/bloglist.js';
import User from '../models/user.js';
import express from 'express';
const router = express.Router();

router.post('/reset', async (request, response) => {
  await BlogList.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

export default router;
