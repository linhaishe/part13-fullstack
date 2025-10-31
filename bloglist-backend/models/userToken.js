import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

class UserToken extends Model {}

UserToken.init(
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
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "UserToken",
    tableName: "user_token",
  }
);

export default UserToken;
