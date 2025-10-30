import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Validation isEmail on username failed",
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "user",
  }
);

export default User;
