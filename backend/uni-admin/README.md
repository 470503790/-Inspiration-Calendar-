# uni-admin 后端资源

本目录用于存放 uni-admin 的后台管理端资源（官方发版包）。请按以下步骤准备：

1. 访问 [uni-admin 官方插件市场](https://ext.dcloud.net.cn/plugin?id=3268) 下载最新的 **uni-admin 后台项目** 压缩包。
2. 解压后将 `uniCloud-aliyun`（或 `uniCloud-tcb`）目录内容放入本目录，形成结构示例：
   ```
   backend/
     uni-admin/
       uniCloud-aliyun/
         cloudfunctions/...
         database/...
         uni_modules/...
   ```
3. 打开 HBuilderX，导入本项目后在 uniCloud 面板选择 "关联已有服务空间"，上传 uni-admin 云函数及 DB 资源。
4. 启动 `uni-admin` 前端（位于官方包 `admin` 目录）或直接在管理端登录后配置 `ic-poster-config` 与 `ic-poster-records` 集合，即可与本仓库的海报生成云函数联动。

> 提示：如仅需数据库管理界面，可在 `backend/uniCloud-aliyun/database` 导入本项目的 schema 后，通过 uni-admin 自动生成 CRUD 页面。
