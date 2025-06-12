import { z } from "zod";

export const notesyncInputSchema = z.object({
  maxResults: z.number().min(1).max(50).default(10),
  query: z.string().optional(),
});
