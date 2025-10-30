# basic info

bloglist-backend was similar to part4 project
此项目将不会使用mongodb数据库，改用relational database - postgres

env files needs following things:

```
PORT=3001
NODE_ENV=development
TEST_MONGODB_URI=''
```

for project:
如果登陆后显示没有权限重新登录即可。

```js
{
  "username": "chenruotest",
  "password": "chenruotestpwd"
}
```
 install devs
```
npm install express dotenv pg sequelize
```

 [sequelize](https://sequelize.org/master/) is the library through which we use Postgres. 

用这个中间件操作/链接数据库
