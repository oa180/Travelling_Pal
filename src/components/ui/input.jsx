import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Light mode defaults
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-base text-gray-900 shadow-sm transition-colors",
        "placeholder:text-gray-500 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Dark mode overrides
        "dark:border-gray-700  dark:text-gray-900 dark:placeholder:text-gray-900",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
