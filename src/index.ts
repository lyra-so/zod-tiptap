import { type Extensions, getSchema } from '@tiptap/core';
import z from 'zod';

function getSchemaInfo(tiptapExtensions: Extensions) {
  const tiptapSchema = getSchema(tiptapExtensions);

  // Extract all node types
  const nodeTypes = Object.keys(tiptapSchema.spec.nodes.toObject()).filter(
    name => name !== 'doc' && name !== 'text',
  );

  // Extract all mark types
  const markTypes = Object.keys(tiptapSchema.spec.marks.toObject());

  // Get node specs for attributes
  const nodeSpecs = tiptapSchema.spec.nodes.toObject();
  const nodeAttrs: Record<string, string[]> = {};

  for (const [name, spec] of Object.entries(nodeSpecs)) {
    if (spec.attrs) {
      nodeAttrs[name] = Object.keys(spec.attrs);
    }
  }

  return { nodeTypes, markTypes, nodeAttrs };
}

export function generateDynamicSchema(tiptapExtensions: Extensions) {
  const { nodeTypes, markTypes } = getSchemaInfo(tiptapExtensions);

  const TextNodeSchema = z.object({
    type: z.literal('text'),
    text: z.string(),
    marks: z
      .array(
        z.object({
          type: z.enum(markTypes as [string, ...string[]]),
          attrs: z.record(z.string(), z.unknown()).optional(),
        }),
      )
      .optional(),
  });

  const NodeSchema: z.ZodType<unknown> = z.lazy(() =>
    z.object({
      type: z.enum(['doc', 'text', ...nodeTypes] as [string, ...string[]]),
      attrs: z.record(z.string(), z.unknown()).optional(),
      content: z.array(z.union([TextNodeSchema, NodeSchema])).optional(),
    }),
  );

  const ProseMirrorDocSchema = z.object({
    type: z.literal('doc'),
    content: z.array(NodeSchema),
  });

  return ProseMirrorDocSchema;
}
