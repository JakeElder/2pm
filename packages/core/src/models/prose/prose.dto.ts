import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

interface Mark {
  type: string;
  attrs?: Record<string, any>;
}

interface Node {
  type: string;
  attrs?: Record<string, any>;
  content?: Node[];
  marks?: Mark[];
  text?: string;
}

export interface Prose {
  type: "doc";
  content: Node[];
}

const MarkSchema: z.ZodType<Mark> = z.object({
  type: z.string(),
  attrs: z.record(z.any()).optional(),
});

const NodeSchema: z.ZodType<Node> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.any()).optional(),
    content: z.array(NodeSchema).optional(),
    marks: z.array(MarkSchema).optional(),
    text: z.string().optional(),
  }),
);

export const ProseDtoSchema: z.ZodType<Prose> = z.object({
  type: z.literal("doc"),
  content: z.array(NodeSchema),
});

export class ProseDto extends createZodDto(ProseDtoSchema) {}
