---
summary: "企业微信机器人支持状态、功能和配置"
read_when:
  - 您想要连接企业微信机器人
  - 您正在配置企业微信渠道
---

# 企业微信机器人

状态：生产就绪，支持企业微信私聊和群组。使用 WebSocket 长连接模式接收消息。

---

## 快速开始

添加企业微信渠道有两种方式：

### 方式一：通过安装向导添加（推荐）

如果您刚安装完 Openclaw，可以直接运行向导，根据提示添加企业微信：

```bash
openclaw-cn onboard
```

向导会引导您完成：

1. 在企业微信中创建智能机器人并获取凭证
2. 配置 Bot ID 和 Secret
3. 启动网关

✅ **完成配置后**，您可以使用以下命令检查网关状态：

- `openclaw-cn gateway status` - 查看网关运行状态
- `openclaw-cn logs --follow` - 查看实时日志

### 方式二：通过命令行添加

如果您已经完成了初始安装，可以用以下命令添加企业微信渠道：

```bash
openclaw-cn channels add
```

然后根据交互式提示选择企业微信，输入 Bot ID 和 Secret 即可。

✅ **完成配置后**，您可以使用以下命令管理网关：

- `openclaw-cn gateway status` - 查看网关运行状态
- `openclaw-cn gateway restart` - 重启网关以应用新配置
- `openclaw-cn logs --follow` - 查看实时日志

---

## 第一步：创建企业微信智能机器人

### 1. 打开创建入口

在企业微信客户端，进入 **工作台**，点击 **智能机器人**，再点击 **创建机器人**，选择 **API 模式** 创建。

![进入智能机器人创建页](../images/wecom1.png)

![选择 API 模式](../images/wecom2.png)

### 2. 选择长连接模式并获取凭证

选择以 **长连接** 方式创建机器人。通过长连接方式创建的智能机器人，支持主动向用户发送消息。

创建完成后，记录以下凭证：

- **Bot ID**：机器人唯一标识
- **Secret**：机器人密钥

❗ **重要**：请妥善保管 Secret，不要分享给他人。

![获取 Bot ID 和 Secret](../images/wecom3.png)

---

## 第二步：关联企业微信机器人与 Openclaw

### 方式一：通过腾讯云 Lighthouse 部署并关联（推荐）

使用腾讯云轻量应用服务器 Lighthouse 部署 Openclaw 时，可通过控制台直接关联机器人：

1. 进入 **腾讯云轻量应用服务器**，选中已部署 Openclaw 的实例，点击进入 **管理实例** 页面
2. 进入 **应用管理** 页
3. 在通道中选择 **企微机器人（长连接）**
4. 依次在输入框内填写前文获取的 **Bot ID** 和 **Secret**
5. 点击 **添加并应用**，在弹出框中点击 **确定**，稍等片刻即可完成配置
6. 回到企业微信机器人创建页面，点击 **保存并创建**

完成后即可在企业微信中与智能机器人正常对话。

### 方式二：通过配置向导关联

运行以下命令，根据提示输入 Bot ID 和 Secret：

```bash
openclaw-cn channels add
```

选择 **企业微信 (WeCom)**，然后输入您在第一步获取的凭证即可。

### 方式三：通过配置文件关联

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "botId": "你的 Bot ID",
      "secret": "你的 Secret"
    }
  }
}
```

---

## 第三步：启动并测试

### 1. 启动网关

```bash
openclaw-cn gateway
```

### 2. 发送测试消息

在企业微信中找到您创建的机器人，发送一条消息。

### 3. 配对授权

默认情况下，机器人会回复一个 **配对码**。您需要批准此代码：

```bash
openclaw-cn pairing approve wecom <配对码>
```

批准后即可正常对话。

---

## 介绍

- **企业微信机器人渠道**：由网关管理的企业微信智能机器人
- **确定性路由**：回复始终返回企业微信，模型不会选择渠道
- **会话隔离**：私聊共享主会话；群组独立隔离
- **WebSocket 长连接**：使用长连接模式，无需公网 URL

---

## 访问控制

### 私聊访问

- **默认**：`dmPolicy: "pairing"`，陌生用户会收到配对码
- **批准配对**：
  ```bash
  openclaw-cn pairing list wecom      # 查看待审批列表
  openclaw-cn pairing approve wecom <CODE>  # 批准
  ```
- **白名单模式**：通过 `channels.wecom.allowFrom` 配置允许的用户 ID

### 群组访问

**群组策略**（`channels.wecom.groupPolicy`）：

- `"open"` = 允许群组中所有人（默认）
- `"allowlist"` = 仅允许 `groupAllowFrom` 中的用户
- `"disabled"` = 禁用群组消息

---

## 获取用户 ID

**方法一**（推荐）：

1. 启动网关并给机器人发消息
2. 运行 `openclaw-cn logs --follow` 查看日志中的用户 ID

**方法二**：
查看配对请求列表，其中包含用户 ID：

```bash
openclaw-cn pairing list wecom
```

---

## 常用命令

| 命令      | 说明           |
| --------- | -------------- |
| `/status` | 查看机器人状态 |
| `/reset`  | 重置对话会话   |
| `/model`  | 查看/切换模型  |

## 网关管理命令

| 命令                          | 说明              |
| ----------------------------- | ----------------- |
| `openclaw-cn gateway status`  | 查看网关运行状态  |
| `openclaw-cn gateway install` | 安装/启动网关服务 |
| `openclaw-cn gateway stop`    | 停止网关服务      |
| `openclaw-cn gateway restart` | 重启网关服务      |
| `openclaw-cn logs --follow`   | 实时查看日志输出  |

---

## 故障排除

### 机器人收不到消息

1. 检查是否选择了 **长连接** 模式（非长连接模式不支持接收消息）
2. 检查 Bot ID 和 Secret 是否填写正确
3. 检查网关是否正在运行：`openclaw-cn gateway status`
4. 查看实时日志：`openclaw-cn logs --follow`

### 机器人在群组中不响应

1. 检查机器人是否已添加到群组
2. 检查 `groupPolicy` 是否为 `"disabled"`
3. 查看日志：`openclaw-cn logs --follow`

### Secret 泄露怎么办

1. 在企业微信管理后台重置 Secret
2. 更新配置文件中的 Secret
3. 重启网关：`openclaw-cn gateway restart`

---

## 完整配置示例

```json
{
  "channels": {
    "wecom": {
      "enabled": true,
      "botId": "your-bot-id",
      "secret": "your-secret",
      "dmPolicy": "pairing",
      "allowFrom": []
    }
  },
  "agents": {
    "defaults": {
      "workspace": "~/clawd"
    }
  }
}
```

---

## 配置参考

完整配置请参考：[网关配置](/gateway/configuration)

主要选项：

| 配置项                     | 说明                       | 默认值    |
| -------------------------- | -------------------------- | --------- |
| `channels.wecom.enabled`   | 启用/禁用渠道              | `true`    |
| `channels.wecom.botId`     | 机器人 Bot ID              | -         |
| `channels.wecom.secret`    | 机器人 Secret              | -         |
| `channels.wecom.dmPolicy`  | 私聊策略                   | `pairing` |
| `channels.wecom.allowFrom` | 私聊白名单（用户 ID 列表） | -         |

---

## dmPolicy 策略说明

| 值            | 行为                                               |
| ------------- | -------------------------------------------------- |
| `"pairing"`   | **默认**。未知用户收到配对码，管理员批准后才能对话 |
| `"allowlist"` | 仅 `allowFrom` 列表中的用户可对话，其他静默忽略    |
| `"open"`      | 允许所有人对话（需在 allowFrom 中加 `"*"`）        |
| `"disabled"`  | 完全禁止私聊                                       |

---

## 支持的消息类型

### 接收

- ✅ 文本消息
- ✅ 图片
- ✅ 文件

### 发送

- ✅ 文本消息
- ✅ Markdown
- ✅ 图片
