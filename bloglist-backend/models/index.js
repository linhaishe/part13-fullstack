import Blog from "./blog.js";
import User from "./user.js";

// need to add a foreign key to the blog table
//  We want to tell Sequelize that there is a One-To-Many relationship between them, meaning that one User has many Blogs, while each Blog belongs to a single User.
// 我们在模型中定义 userId，但这通常没必要，因为下面的方式可以直接处理外键问题
User.hasMany(Blog);
Blog.belongsTo(User);
await Blog.sync({ alter: true });
await User.sync({ alter: true });

export { Blog, User };
