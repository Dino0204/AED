import { z } from "zod";

const EnvSchema = z.object({
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  PORTFOLIO_OWNER: z.string().min(1),
  PORTFOLIO_REPO: z.string().min(1),
  N8N_WEBHOOK_BOOTSTRAP: z.string().optional().default(""),
  N8N_WEBHOOK_COLLECT: z.string().optional().default(""),
  N8N_WEBHOOK_ANALYZE: z.string().optional().default(""),
  N8N_WEBHOOK_SECRET: z.string().min(1),
});

export const env = EnvSchema.parse({
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  PORTFOLIO_OWNER: process.env.PORTFOLIO_OWNER,
  PORTFOLIO_REPO: process.env.PORTFOLIO_REPO,
  N8N_WEBHOOK_BOOTSTRAP: process.env.N8N_WEBHOOK_BOOTSTRAP,
  N8N_WEBHOOK_COLLECT: process.env.N8N_WEBHOOK_COLLECT,
  N8N_WEBHOOK_ANALYZE: process.env.N8N_WEBHOOK_ANALYZE,
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
});
