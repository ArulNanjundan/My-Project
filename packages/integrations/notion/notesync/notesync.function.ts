import { z } from "zod";
import { notesyncInputSchema } from "./notesync.schema";

export const listNotes = async (input: z.infer<typeof notesyncInputSchema>) => {
  const validatedInput = notesyncInputSchema.parse(input);

  const mockNotes = [
    { id: "1", title: "Welcome Note", content: "This is your first note" },
    { id: "2", title: "Project Ideas", content: "Build an AI app using Next.js" },
    { id: "3", title: "Daily Goals", content: "1. Code\n2. Eat\n3. Sleep" },
  ];

  const query = validatedInput.query?.toLowerCase();

  const filteredNotes = query
    ? mockNotes.filter(note =>
        note.title.toLowerCase().includes(query)
      )
    : mockNotes;

  const result = filteredNotes.slice(0, validatedInput.maxResults);

  return {
    notes: result,
    count: result.length,
  };
};
