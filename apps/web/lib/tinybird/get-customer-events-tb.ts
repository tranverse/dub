import { z } from "zod";
import { tb } from "./client";

// Cast `tb` to `any` here for the same reason as other callers: avoid
// TypeScript errors when different zod compile-time instances are present.
const pipe = (tb as any).buildPipe({
  pipe: "v2_customer_events",
  parameters: z.unknown(), // TODO
  data: z.unknown(), // TODO
});

export const getCustomerEventsTB = async ({
  customerId,
  linkIds,
}: {
  customerId: string;
  linkIds?: string[];
}) => {
  return await pipe({
    customerId,
    ...(linkIds ? { linkIds } : {}),
  });
};
