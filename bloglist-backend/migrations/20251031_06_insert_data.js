import { Model, DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  // === 初始化用户数据 ===
  await queryInterface.bulkInsert("users", [
    {
      username: "Alice",
      name: "Alice-name",
      email: "alice@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: "Bob",
      name: "Bob-name",
      email: "bob@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  await queryInterface.bulkInsert("blogs", [
    {
      author: "Alice",
      title: "Intro to Node.js",
      url: "https://nodejs.org/en/docs/",
      likes: 10,
      year: 2021,
      user_id: 1, // Alice 的博客
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      author: "Alice",
      title: "Mastering Sequelize",
      url: "https://sequelize.org/docs/",
      likes: 5,
      year: 2022,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      author: "Bob",
      title: "Understanding Express Middleware",
      url: "https://expressjs.com/en/guide/using-middleware.html",
      likes: 7,
      year: 2020,
      user_id: 2, // Bob 的博客
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      author: "Bob",
      title: "Docker for Developers",
      url: "https://docs.docker.com/get-started/",
      likes: 3,
      year: 2023,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
