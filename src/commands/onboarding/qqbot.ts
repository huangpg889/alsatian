import type { ClawdbotConfig } from "../../config/config.js";
import type { ChannelOnboardingAdapter } from "./types.js";

const CHANNEL_ID = "qqbot" as const;

export const qqbotOnboardingAdapter: ChannelOnboardingAdapter = {
  channel: CHANNEL_ID,
  getStatus: async ({ cfg }) => {
    const channelCfg = (cfg.channels as Record<string, unknown> | undefined)?.[CHANNEL_ID] as
      | Record<string, unknown>
      | undefined;
    const configured = Boolean(channelCfg?.appId && channelCfg?.clientSecret);
    return {
      channel: CHANNEL_ID,
      configured,
      statusLines: [`QQ: ${configured ? "已配置" : "需要填写凭证"}`],
      selectionHint: configured ? "recommended · configured" : "需要 QQ 开放平台应用凭证",
      quickstartScore: configured ? 1 : 10,
    };
  },
  configure: async ({ cfg, prompter }) => {
    const channelCfg = (cfg.channels as Record<string, unknown> | undefined)?.[CHANNEL_ID] as
      | Record<string, unknown>
      | undefined;

    const existingAppId = (channelCfg?.appId as string | undefined) ?? "";
    const appId = String(
      await prompter.text({
        message: "输入 QQ 机器人 AppID",
        initialValue: existingAppId,
        validate: (val) => (val?.trim() ? undefined : "必填"),
      }),
    ).trim();

    const existingClientSecret = (channelCfg?.clientSecret as string | undefined) ?? "";
    const clientSecret = String(
      await prompter.text({
        message: "输入 QQ 机器人 AppSecret（clientSecret）",
        initialValue: existingClientSecret,
        validate: (val) => (val?.trim() ? undefined : "必填"),
      }),
    ).trim();

    const next = applyQQBotConfig(cfg, { appId, clientSecret });
    return { cfg: next };
  },
  disable: (cfg) => {
    const next = { ...cfg } as ClawdbotConfig;
    const channels = { ...(next.channels as Record<string, unknown> | undefined) };
    const existing = channels[CHANNEL_ID] as Record<string, unknown> | undefined;
    if (existing) {
      channels[CHANNEL_ID] = { ...existing, enabled: false };
      next.channels = channels as ClawdbotConfig["channels"];
    }
    return next;
  },
};

function applyQQBotConfig(
  cfg: ClawdbotConfig,
  updates: { appId: string; clientSecret: string },
): ClawdbotConfig {
  const next = { ...cfg } as ClawdbotConfig;
  const channels = { ...(next.channels as Record<string, unknown> | undefined) };
  const existing = (channels[CHANNEL_ID] as Record<string, unknown> | undefined) ?? {};
  channels[CHANNEL_ID] = {
    ...existing,
    appId: updates.appId,
    clientSecret: updates.clientSecret,
    enabled: true,
  };
  next.channels = channels as ClawdbotConfig["channels"];
  return next;
}
