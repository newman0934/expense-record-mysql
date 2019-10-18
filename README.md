# record expense
不讓媽媽看到的爸爸支出記帳表(mysql版)

## Features
- 列出所有的支出
- 篩選支出列別
- 修改支出
- 新增支出
- 刪除支出
- 使用者登入、登出、註冊
- Facebook登入
## Quick view

![index page](https://raw.githubusercontent.com/newman0934/expense-record-mysql/master/public/img/index.png)
![edit page](https://raw.githubusercontent.com/newman0934/expense-record-mysql/master/public/img/edit.png)
![login page](https://raw.githubusercontent.com/newman0934/expense-record-mysql/master/public/img/login.png)
![register page](https://raw.githubusercontent.com/newman0934/expense-record-mysql/master/public/img/register.png)


### Installation
- 進入cmd
- 輸入git clone https://github.com/newman0934/expense-record-mysql.git
- cd到expense-record-mysql資料夾
- 在cmd輸入npm install安裝套件
- 進入config/config.json更改password為你的資料庫的password、database為expense_record_mysql
- 建立資料庫
```js
drop database if exists expense_record_mysql;
create database expense_record_mysql;
use expense_record_mysql;
```
- 在根目錄新增一個.env檔案並把以下code輸入到裡面
```js
FACEBOOK_ID=你的facebook_id
FACEBOOK_SECRET=你的facebook密鑰
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
```
- 輸入node app.js
- 在瀏覽器上進入http://localhost:3000
