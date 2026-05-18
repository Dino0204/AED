import { z } from "zod";

export const MemoSchema = z.object({
  id: z.string(),
  date: z.string(),
  content: z.string(),
});

export const MemosSchema = z.object({
  memos: z.array(MemoSchema),
});

export type Memos = z.infer<typeof MemosSchema>;

export const PortfolioItemSchema = z.object({
  id: z.string(),
  type: z.enum(["project", "skill", "award", "experience"]),
  section: z.string(),
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_file: z.string().optional(),
  added_at: z.string().optional(),
});

export const PortfolioSchema = z.object({
  version: z.string(),
  generated_at: z.string().optional(),
  items: z.array(PortfolioItemSchema),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;

export const HistoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  target_id: z.string(),
  target_title: z.string(),
  source_context: z.array(z.string()),
  ai_suggestion: z.enum(["add", "remove", "keep"]),
  ai_reason: z.string(),
  user_decision: z.enum(["add", "remove", "keep"]),
  user_reason: z.string(),
  applied: z.boolean(),
  issue_url: z.string().optional(),
});

export const HistorySchema = z.object({
  version: z.string(),
  entries: z.array(HistoryEntrySchema),
});

export type History = z.infer<typeof HistorySchema>;

export const ConfigSchema = z.object({
  sources: z.object({
    github: z.boolean(),
    notion: z.boolean().optional(),
  }),
  schedule: z.enum(["manual", "biweekly"]).default("manual"),
});

export type Config = z.infer<typeof ConfigSchema>;
