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
    .enum(["claude-3-5-haiku-latest", "claude-sonnet-4-20250514"])
    .optional()
    .default("claude-sonnet-4-20250514"),
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

    // const result = streamText({
    //   model: anthropic(
    //     model as "claude-3-5-haiku-latest" | "claude-sonnet-4-20250514",
    //   ),
    //   messages: [
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   maxTokens: 300,
    // });

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const stream = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${content}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });
    // only count usage for the sonnet model
    if (model === "claude-sonnet-4-20250514") {
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

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleAndReturnErrorResponse(error);
  }
});
