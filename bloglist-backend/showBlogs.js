import 'dotenv/config'
import { Sequelize, DataTypes, QueryTypes } from 'sequelize'

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

    // // 查询所有博客 option 1 using Sequelize
    // const blogs = await Blog.findAll()
    // console.log('📚 Blogs in database:')
    // blogs.forEach(blog => {
    //   console.log(`${blog.id}. ${blog.title} by ${blog.author} (${blog.likes} likes)`)
    // })

    // option 2 SQL way
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    console.log(blogs)

    await sequelize.close()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

main()
