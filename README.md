# 黑白测评组官网

当前版本：P1 公开网页样刊。Next.js / TypeScript / Tailwind；后续接入 Supabase Auth、PostgreSQL、Storage、Cron。

**在线预览：** https://obedientdem.github.io/bwpone/zh/

包含48个中英双语公开页面，支持搜索、筛选、排序、语言切换和未开放服务提示弹窗。内容、评分、活动均明确标为示例；账号、后台、报名、抽奖和数据库业务尚未实现。当前无需密钥或后端服务。

## 本地开发

需要 Node.js 22.13+，推荐 Node.js 24。在仓库根目录执行：

```bash
npm ci
npm run dev
```

打开 http://localhost:3000/zh 或 http://localhost:3000/en。

## 检查与构建

```bash
npm run check
npm test
npm run build
npm run verify:build
npm start
```

GitHub Pages 使用静态导出，保留客户端交互：

```bash
npm run stage:pages
npm run verify:build
git add .
git commit -m "Update P1 preview"
git push origin main
```

`stage:pages` 将导出结果同步到仓库根目录，沿用现有 Pages 的 `main / (root)` 发布设置。源码修改后需重新执行此命令，再提交推送；Pages 自动发布提交后的静态文件。`npm run build:pages` 仅生成 `out/`，不更新根目录展示文件。`.github/workflows/validate.yml` 自动执行类型、逻辑测试、静态构建和链接检查。

默认站点子路径为 `/bwpone`，可通过 `NEXT_PUBLIC_BASE_PATH` 指定其他仓库名称。静态托管不提供 Next.js 服务端响应头；页面保留 noindex 元信息和 robots.txt。

## 接续开发

先读 `PROGRESS.md`；需求基线：`docs/requirements/WORK_HANDOFF_V1.md`；技术决策：`docs/P0_DECISION.md`；阶段验收：`docs/P1_ACCEPTANCE.md`；原创素材记录：`docs/ASSETS.md`。

`src/` 为完整源码，`public/` 为源素材。根目录 `zh/`、`en/`、`_next/`、`images/` 等为 GitHub Pages 展示产物；`preview/` 是原交付包的离线只读版。原始 P0/P1 本地提交历史保存在 `history/P1_HISTORY.bundle`，后续开发使用本仓库 main。

示例数据源为 `src/data/demo.ts`，图集为原创虚构场景。100万+ / 2000+ 品牌指标沿用需求，口径待核实且非实时；不虚构成员、客户或合作案例。真实浏览器交互、桌面/移动端视觉和辅助技术验收仍待完成。
