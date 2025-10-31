import Blog from "./blog.js";
import User from "./user.js";
import UserMarks from "./userMarks.js";
import UserToken from "./userToken.js";

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserMarks, as: "marked_blogs" });
Blog.belongsToMany(User, { through: UserMarks, as: "users_marked" });

User.hasOne(UserToken, { foreignKey: "userId" });
UserToken.belongsTo(User, { foreignKey: "userId" });

export { Blog, User, UserMarks, UserToken };
