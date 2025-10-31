import { cn } from "@dub/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10 text-black dark:text-white", className)}
    >
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        fontFamily="Inter, sans-serif"
      >
        B
      </text>
    </svg>
  );
}
