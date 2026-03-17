import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 hover:-translate-y-0.5": variant === "default",
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
            "border border-border bg-background shadow-sm hover:bg-secondary hover:text-secondary-foreground": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-secondary hover:text-secondary-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-lg px-3 text-sm": size === "sm",
            "h-12 rounded-xl px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
