import Blog from "./blog.js";
import User from "./user.js";
import UserMark from "./userMarks.js";

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserMark });
Blog.belongsToMany(User, { through: UserMark });

User.hasMany(UserMark, { foreignKey: "userId" });
UserMark.belongsTo(User, { foreignKey: "userId" });

Blog.hasMany(UserMark, { foreignKey: "blogId" });
UserMark.belongsTo(Blog, { foreignKey: "blogId" });

export { Blog, User, UserMark };
