import express from 'express';
import jwt from 'jsonwebtoken';
import BlogList from '../models/bloglist.js';
const blogListsRouter = express.Router();
// blogListsRouter.get('/', (request, response) => {
//   BlogList.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });
//
// {
// "title": "its new blog test-6",
// "author": "chenruo",
// "url": "none",
// "userId": "68bac7a73c634050a65a35db"
// }

blogListsRouter.get('/', async (request, response) => {
  try {
    const blogs = await BlogList.find({}).populate('user').lean();
    const result = blogs.map((blogItem) => ({
      ...blogItem,
      showRemoveBtn: request.user
        ? blogItem?.user?._id?.toString() === request?.user?.id?.toString()
        : false,
    }));

    response.json(result);
  } catch (err) {
    console.error('Error in GET /blogs:', err.message);

    return response.status(401).json({
      error: 'invalid or missing token',
    });
  }
});

blogListsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await BlogList.findById(request.params.id)
      .populate('user')
      .lean();

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    // 这里捕获无效的 ObjectId
    response.status(400).send({ error: 'malformatted id' });
  }
});

// add comment
blogListsRouter.post('/:id', async (request, response) => {
  try {
    const body = request.body;
    const token = request.token;

    if (!token) {
      return response.status(401).json({ error: 'token missing' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return response.status(401).json({ error: 'token invalid' });
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = request.user;
    if (!user) {
      return response
        .status(400)
        .json({ error: 'UserId missing or not valid' });
    }

    // 找到对应的 blog
    const blog = await BlogList.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    const newCommentId =
      blog.comments.length > 0
        ? Math.max(...blog.comments.map((c) => c.id)) + 1
        : 0;

    // 追加评论
    const newComment = {
      id: newCommentId,
      comment: body.comment,
    };

    blog.comments.push(newComment);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).send({ error: 'malformatted id' });
  }
});

// add blog
blogListsRouter.post('/', async (request, response) => {
  try {
    const body = request.body;
    const token = request.token;

    if (!token) {
      return response.status(401).json({ error: 'token missing' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return response.status(401).json({ error: 'token invalid' });
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = request.user;
    if (!user) {
      return response
        .status(400)
        .json({ error: 'UserId missing or not valid' });
    }

    const blog = new BlogList({ ...body, user: user._id });
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogListsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await BlogList.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  // 注意：blog.user是 ObjectId，要转成字符串
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response
      .status(403)
      .json({ error: 'only the creator can delete this blog' });
  }

  BlogList.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogListsRouter.put('/:id', (request, response, next) => {
  const { title, url } = request.body;

  BlogList.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.title = title;
      note.url = url;
      note.likes++;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

export default blogListsRouter;
