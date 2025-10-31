import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import config from "./config.js";
import { Umzug, SequelizeStorage } from "umzug";
dotenv.config();

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// const runMigrations = async () => {
//   const migrator = new Umzug({
//     migrations: {
//       glob: "migrations/*.js",
//     },
//     storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
//     context: sequelize.getQueryInterface(),
//     logger: console,
//   });

//   const migrations = await migrator.up();
//   console.log("Migrations up to date", {
//     files: migrations.map((mig) => mig.name),
//   });
// };

export const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

export const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("👀 Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

// 定义 Blog 模型
// export const Blog = sequelize.define(
//   "Blog",
//   {
//     author: DataTypes.STRING,
//     url: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     likes: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//   },
//   {
//     tableName: "blogs",
//     timestamps: false,
//   }
// );

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    // // 在这里同步表结构
    // // 会在数据库中创建表（如果表不存在）返回一个 Promise，可以加 await 等待完成，一般只在初始化数据库时调用一次
    // await Blog.sync(); // <-- 放在这里最安全
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Unable to connect:", err);
    return process.exit(1);
  }
  return null;
};
