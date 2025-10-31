import Blog from "./blog.js";
import User from "./user.js";
import UserMarks from "./userMarks.js";

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserMarks, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: UserMarks, as: 'users_marked' })

export { Blog, User, UserMarks };
