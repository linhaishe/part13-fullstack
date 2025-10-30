import BlogList from '../models/bloglist.js';
import User from '../models/user.js';

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'david',
    url: 'none',
    likes: 22,
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'chenruo',
    url: 'none',
    likes: 33,
  },
  {
    title: 'test note 2',
    author: 'chenruo',
    url: 'none',
    likes: 0,
    user: {
      username: 'root',
      name: 'who has not access to delete',
      blogs: [
        '68bad0660118b861a93147e4',
        '68bad0a2098f6bae5b59f994',
        '68badeb6ca65eaa64bacfcee',
        '68badf5e5a27f50f9bfdd9d7',
      ],
      id: '68bac7a73c634050a65a35d8',
    },
  },
];

//该函数可用于创建不属于数据库中任何便笺对象的数据库对象 ID
const nonExistingId = async () => {
  const blog = new BlogList({
    title: 'will remove this soon',
    author: 'chenruo',
    url: 'none',
    likes: 33,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

//该函数可用于检查数据库中存储的便笺。 包含初始数据库状态的 initialBlogs 数组也在模块中
const blogsInDb = async () => {
  const blogs = await BlogList.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

export { initialBlogs, nonExistingId, blogsInDb, usersInDb };
