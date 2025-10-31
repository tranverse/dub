import { handleAndReturnErrorResponse } from "@/lib/api/errors";
import { throwIfAIUsageExceeded } from "@/lib/api/links/usage-checks";
import { normalizeWorkspaceId } from "@/lib/api/workspaces/workspace-id";
import { withWorkspace } from "@/lib/auth";
import z from "@/lib/zod";
import { prismaEdge } from "@dub/prisma/edge";
import { waitUntil } from "@vercel/functions";
import OpenAI from "openai";
const completionSchema = z.object({
  prompt: z.string(),
  model: z
    .enum([
      "claude-3-5-haiku-latest",
      "claude-sonnet-4-20250514",
      "anthropic/claude-sonnet-4",
    ])
    .optional()
    .default("anthropic/claude-sonnet-4"),
});

// POST /api/ai/completion – Generate AI completion
export const POST = withWorkspace(async ({ req, workspace }) => {
  try {
    const {
      // comment for better diff
      prompt,
      model,
    } = completionSchema.parse(await req.json());

    throwIfAIUsageExceeded(workspace);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const rawText = completion.choices[0].message.content!;
    // only count usage for the sonnet model
    if (model === "anthropic/claude-sonnet-4") {
      waitUntil(
        prismaEdge.project.update({
          where: { id: normalizeWorkspaceId(workspace.id) },
          data: {
            aiUsage: {
              increment: 1,
            },
          },
        }),
      );
    }

    return new Response(rawText);
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
});
