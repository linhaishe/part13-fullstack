import { Model, DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("user_marks", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "blogs", key: "id" },
    },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("user_marks");
}
