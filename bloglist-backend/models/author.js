import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

class Author extends Model {}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    articles: {
      type: DataTypes.INTEGER,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "author",
  }
);

export default Author;
