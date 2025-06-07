import { z } from 'zod'

export const listNotesSchema = z.object({
  query: z.string().optional(),
  maxResults: z.number().min(1).max(10).optional(),
})

export const addNoteSchema = z.object({
  title: z.string().min(1),
})

export type ListNotesInput = z.infer<typeof listNotesSchema>
export type AddNoteInput = z.infer<typeof addNoteSchema>