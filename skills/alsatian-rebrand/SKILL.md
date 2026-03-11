---
name: Alsatian 品牌重命名
description: 将项目从 openclaw-cn 重命名为 Alsatian 并发布到 npm。当需要继续品牌重命名、更新包名、修改 Web UI 标识、替换图标、或修改 CI/CD 发布配置时使用。
---

# Alsatian 品牌重命名

本项目从 `openclaw-cn` fork，目标是以 `@3onedata/alsatian` 名称发布到 npm。

## 已完成改动

### `package.json`

- `name`: `openclaw-cn` → `@3onedata/alsatian`
- `description`: 改为 `Alsatian - WhatsApp gateway CLI (Baileys web) with Pi RPC agent`
- `repository.url`: → `https://github.com/huangpg889/alsatian`
- `bin`: 新增 `"alsatian": "dist/entry.js"`（保留原有 3 个）
- `scripts`: 新增 `"alsatian": "node scripts/run-node.mjs"`（保留 `"openclaw-cn"`）
- `pnpm.overrides`: 新增 `"alsatian": "link:."`（保留 `"openclaw"`）

### `ui/index.html`

- `<title>`: `Clawdbot Control` → `Alsatian Control`

## 待完成改动

### Web UI 图标（需用户提供素材）

- `ui/public/favicon.svg` — 主 logo，当前为橙红色龙虾爪 SVG
- `ui/public/favicon.ico` — favicon（16x16 / 32x32）

### Web UI 文字（按需，用户确认后修改）

| 文件                           | 位置               | 内容                                 |
| ------------------------------ | ------------------ | ------------------------------------ |
| `ui/src/ui/app-render.ts`      | line 192           | `https://docs.openclaw.ai` 文档链接  |
| `ui/src/ui/app-scroll.ts`      | line 149           | 日志下载文件名前缀 `openclaw-logs-`  |
| `ui/src/ui/navigation.ts`      | line 214           | 提示文字 `~/.openclaw/openclaw.json` |
| ~~`ui/src/ui/views/usage.ts`~~ | ~~5113/5125/5137~~ | ✅ 已改为 `alsatian-usage-`          |

> `ui/src/ui/views/agents.ts` 和 `skills.ts` 中的 `"openclaw-workspace"` 等为 skill source 枚举标识，需与后端同步确认后再改。

### CI/CD

- `.github/workflows/docker-build-multiarch.yml`: `IMAGE_NAME: jiulingyun803/openclaw-cn` → 新镜像名
- `.github/workflows/upstream-monitor.yml`: 是否继续监控上游，按需处理

### Extension 包

- ⏭️ 跳过，保留原样（`@openclaw-cn/` scope 不改）

### Docker 配置

- ⏭️ 跳过，保留原样

## 注意事项

- `@openclaw-cn/baileys` 和 `@openclaw-cn/libsignal` 依赖的 scope **不改**，沿用原包
- `npm-publish.yml` 无需修改，`--access public` 已正确配置 scoped 包发布
- 发布前需在 GitHub Actions Secrets 中配置 `NPM_TOKEN`，且该 token 须对 `@3onedata` scope 有发布权限
