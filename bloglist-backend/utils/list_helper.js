// 判断是否数组，返回 1（常用于测试）
export const dummy = (blogs) => (Array.isArray(blogs) ? 1 : 0);

// 计算总点赞数
export const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

// 找到点赞最多的博客
export const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const topBlog = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  );
  return {
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes,
  };
};

// 拥有最多博客的作者
export const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const count = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const [author, blogsCount] = Object.entries(count).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );

  return { author, blogs: blogsCount };
};

// 点赞总数最多的作者
export const mostLike = (blogs) => {
  if (blogs.length === 0) return null;

  const count = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const [author, likes] = Object.entries(count).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );

  return { author, likes };
};
