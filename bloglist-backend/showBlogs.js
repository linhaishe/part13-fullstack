import 'dotenv/config'
import { Sequelize, DataTypes } from 'sequelize'

// 连接数据库
const sequelize = new Sequelize(process.env.DATABASE_URL)

// 定义 Blog 模型
const Blog = sequelize.define('Blog', {
  author: DataTypes.STRING,
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'blogs',
  timestamps: false
})

// 主函数
const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database')

    // 查询所有博客
    const blogs = await Blog.findAll()

    // 打印结果
    console.log('📚 Blogs in database:')
    blogs.forEach(blog => {
      console.log(`${blog.id}. ${blog.title} by ${blog.author} (${blog.likes} likes)`)
    })

    await sequelize.close()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

main()
