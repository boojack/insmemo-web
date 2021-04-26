# Insmemo roadmap

flomo + 知识星球

## 特点

- 主要并且完全支持数据的本地化存储；
- 更好的交互逻辑；

## TODO

- [x] 数据本地存储逻辑；
- [x] 补充 memo；
- [x] memo 标签；
- [x] 错误处理 & toast 提示；
- [x] editor 优化；
- [x] 移动端样式适配；
- [x] 去掉本地存储逻辑（不好管理数据），完善账号注册/登录；
- [ ] memo 编辑；

## Versions

### v0.1.0

- memo 标签；
- 操作结果伴随着 toast 提示；
- 移动端适配；
- 样式美化；

### v0.0.1

- Memo 模块：
  - 增加、删除、修改、查；
  - localStorage 存储；
  - 补充随笔;
- Account 模块 (Done)：
  - 登录；
  - 注销；

## Daily Plan

### 2021/4/9

- [x] 数据本地存储逻辑；
- [ ] 完善文案，发版 v0.0.1;

### 2021/4/8

- [x] 账号模块；
      api:
  - /api/user/me check sign in status
  - /api/user/signin sign in
  - /api/user/signup sign up
  - /api/user/signout sign out
- [x] memo 模块
      api:
  - get /api/memo/all?page=0&
  - post /api/memo/new new memo
  - post /api/memo/delete delete memo
  - post /api/memo/update update
- [ ] memo 本地存储
      未登录时，自动本地存储；登录后，将其转为线上

### 2021/4/6

- [x] 后台项目初始化；
- [ ] 账号模块；

### 2021/4/5

- [x] memo item 增加操作按钮：删除；
- [ ] 后台项目初始化；
- [ ] 优化 editor 根据内容自动增高；
