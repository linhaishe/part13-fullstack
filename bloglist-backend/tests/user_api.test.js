import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import supertest from 'supertest';
import User from '../models/user.js';
import { usersInDb } from '../tests/test_helper.js';
import app from '../app.js';
const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'chenruotest',
      name: 'chenruo li',
      password: 'chenruotestpwd',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    // assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    // assert(usernames.includes(newUser.username));
    expect(usernames).toContain(newUser.username);
  });
});

describe('when there is initially one user in db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'chenruotestpwd',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    // assert(result.body.error.includes('expected `username` to be unique'));
    expect(result.body.error).toContain(
      'E11000 duplicate key error collection'
    );
    // assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe('username or pwd is not given', () => {
  test('creation fails with proper statuscode and message if username missing', async () => {
    const newUser = {
      username: '',
      name: 'Superuser',
      password: 'chenruotestpwd',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password are required');
  });
});

describe('username or pwd less then 3 characters', () => {
  test('creation fails with proper statuscode and message if words short', async () => {
    const newUser = {
      username: '3w',
      name: 'Superuser',
      password: 'chenruotestpwd',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'username and password must be at least 3 characters long'
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
