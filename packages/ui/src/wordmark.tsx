import { cn } from "@dub/utils";
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      width="46"
      height="24"
      viewBox="0 0 46 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-auto text-black dark:text-white", className)}
    >
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Poppins, Rounded, Arial, sans-serif"
        font-weight="700"
        font-size="21"
        fill="currentColor"
      >
        Buzz
      </text>
    </svg>
  );
}
