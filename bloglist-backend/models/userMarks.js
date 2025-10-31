import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

class UserMark extends Model {}

UserMark.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "blogs", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "UserMark",
    tableName: "user_marks",
  }
);

export default UserMark;
