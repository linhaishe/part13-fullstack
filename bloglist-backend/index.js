import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

// 载入 .env 文件
dotenv.config()

// 创建 Sequelize 实例
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // 可选，明确指定数据库类型
  logging: false,      // 不打印 SQL 日志（可选）
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    await sequelize.close()
  }
}

main()
