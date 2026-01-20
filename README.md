# zod-tiptap

Dynamically generate Zod schemas from TipTap extensions for type-safe AI integration and document validation.

## Installation

```bash
npm install zod-tiptap
# or
pnpm add zod-tiptap
# or
yarn add zod-tiptap
```

## Usage

### With AI-SDK Tools

The generated Zod schema can be used as an input/output schema for AI-SDK tools:

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import { generateDynamicSchema } from 'zod-tiptap';
import StarterKit from '@tiptap/starter-kit';

const tiptapExtensions = [
  StarterKit,
  // ...or any TipTap extension
];

const tiptapDocumentSchema = generateDynamicSchema(tiptapExtensions);

export const createDocument = tool({
  description: 'Create a new document artifact.',
  inputSchema: tiptapDocumentSchema,
  outputSchema: z.object({
    id: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ name, content }) => {
    // Your TipTap document creation logic here
    return { id: 'doc_123', success: true };
  },
});
```

## License

MIT
