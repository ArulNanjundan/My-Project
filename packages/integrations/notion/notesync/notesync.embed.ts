// packages/integrations/notion/notesync/notesync.embed.ts

/**
 * This file provides metadata or a reusable UI config
 * for embedding `notesync` in other apps or dashboards.
 */

export const notesyncEmbed = {
  name: 'NoteSync',
  description: 'Mock Notion Notes Integration',
  instructions: 'Use this integration to fetch notes by keyword.',
  inputExample: {
    query: 'project ideas',
    maxResults: 3,
  },
  fields: [
    {
      name: 'query',
      type: 'string',
      label: 'Search Term',
      required: true,
    },
    {
      name: 'maxResults',
      type: 'number',
      label: 'Maximum Notes',
      default: 3,
    },
  ],
}
