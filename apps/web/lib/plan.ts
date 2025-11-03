import { PlanProps, plans } from "./types";

export function isPlan(value: unknown): value is PlanProps {
  return (
    typeof value === "string" && (plans as readonly string[]).includes(value)
  );
}

export function isEnterprise(
  workspace: { plan?: string } | { plan: PlanProps },
): boolean {
  return workspace?.plan === "enterprise";
}

export function ensurePlan(value: unknown): PlanProps {
  if (isPlan(value)) return value;
  throw new Error(`Invalid plan value: ${String(value)}`);
}

export function ensureEnterprise(
  workspace: { plan?: string } | { plan: PlanProps },
) {
  if (!isEnterprise(workspace)) {
    throw new Error("Enterprise plan required");
  }
}

export default {
  isPlan,
  isEnterprise,
  ensurePlan,
  ensureEnterprise,
};
