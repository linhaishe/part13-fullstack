import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { initialBlogs, blogsInDb, nonExistingId } from './test_helper.js';
import app from '../app.js';
const api = supertest(app);
import BlogList from '../models/bloglist.js';
import User from '../models/user.js';

let firstUserToken;
let secondUserToken;

beforeEach(async () => {
  await BlogList.deleteMany({});
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('chenruotestpwd', 10);
  const user = new User({ username: 'chenruotest', passwordHash });
  const savedUser = await user.save();

  const passwordHash2 = await bcrypt.hash('user2', 10);
  const user2 = new User({ username: 'testuser2', passwordHash2 });
  const savedUser2 = await user2.save();

  const blogObjects = initialBlogs.map(
    (blog) => new BlogList({ ...blog, user: savedUser._id })
  );

  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);

  let blogObj = new BlogList(blogObjects[0]);
  await blogObj.save();

  blogObj = new BlogList(blogObjects[1]);
  await blogObj.save();

  blogObj = new BlogList(blogObjects[2]);
  await blogObj.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  const userForToken2 = {
    username: savedUser2.username,
    id: savedUser2._id,
  };

  firstUserToken = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  secondUserToken = jwt.sign(userForToken2, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
});

test('blog posts have id property instead of _id', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
  });
});

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are three notes', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(3);
  });

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].title).toBe('HTML is easy');
  });
});

describe('addition of a new note', () => {
  test('a valid note can be added', async () => {
    const newBlog = {
      title: 'its new blog test',
      author: 'chenruo',
      url: 'none',
      likes: 11,
      userId: '68bac7a73c634050a65a35db',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const contents = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(contents).toContain('its new blog test');
  });

  test('blog without title is not added and returns 400', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://example.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newBlog)
      .expect(400);
  });

  test('blog without url is not added and returns 400', async () => {
    const newBlog = {
      title: 'Blog without URL',
      author: 'No URL Author',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newBlog)
      .expect(400);
  });

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Someone',
      url: 'http://example.com',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test('cant post without token/userid', async () => {
    const newBlog = {
      title: 'Blog without token test',
      author: 'someone',
      url: 'http://example.com',
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('token missing');
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await blogsInDb();
    const noteToView = notesAtStart[0];
    const resultNote = await api
      .get(`/api/blogs/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultNote.body).toStrictEqual({
      ...noteToView,
      user: noteToView.user.toString(),
    });
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id and user verify is valid', async () => {
    const notesAtStart = await blogsInDb();
    const noteToDelete = notesAtStart[0];
    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .expect(204);

    const notesAtEnd = await blogsInDb();
    const contents = notesAtEnd.map((n) => n.title);
    expect(contents).not.toContain(noteToDelete.title);
  });

  test('a blog can be deleted only by the user who added it', async () => {
    const allBlogs = await blogsInDb();
    const blogToDelete = allBlogs[0];
    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'only the creator can delete this blog'
    );
  });
});

// 204 不返回 JSON，所以不能用 .expect('Content-Type', ...)。
// 更新断言应该检查 更新后的内容，而不是旧的内容。
// 推荐返回 200 + JSON，这样可以直接在测试里拿到更新后的对象做验证。

describe('updating of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      ...blogToUpdate,
      title: 'new update title test',
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).toBe('new update title test');

    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
    expect(updatedBlog.title).toBe('new update title test');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
