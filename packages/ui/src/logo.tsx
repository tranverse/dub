import { cn } from "@dub/utils";
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10 text-black dark:text-white", className)}
    >
      <rect width="64" height="64" fill="none" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Poppins, Rounded, Arial, sans-serif"
        fontWeight="700"
        fontSize="28"
        fill="currentColor"
      >
        Buzz
      </text>
    </svg>
  );
}
