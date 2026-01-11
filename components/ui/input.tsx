"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
} from "@phosphor-icons/react/dist/ssr";

const inputVariants = cva(
  "inline-flex w-full border border-accent bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary disabled:cursor-not-allowed disabled:opacity-50 dark:border-accent/50 dark:bg-input/30 dark:focus:border-tertiary dark:focus:ring-tertiary/40 dark:placeholder:text-muted-foreground/50 dark:text-primary-foreground rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        ghost: "bg-transparent border-0 focus:ring-0 focus:ring-offset-0",
      },
      size: {
        default: "h-10 py-3 text-sm",
        sm: "h-9 py-1 text-xs",
        lg: "h-12 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, icon, iconRight, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-[calc(50%-1rem)] text-muted-foreground pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          className={cn(
            inputVariants({ variant, size, className }),
            // Dynamic Padding: If icon exists, add padding-left; otherwise default padding
            icon ? "pl-10" : "pl-3",
            // Dynamic Padding: If iconRight exists, add padding-right; otherwise default padding
            iconRight ? "pr-10" : "pr-3"
          )}
          {...props}
        />

        {/* Right Icon */}
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
            {iconRight}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleVisibility = () => setShowPassword(!showPassword);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={className}
        // Default Lock icon on the left (optional, remove if unwanted)
        icon={<LockKeyIcon size={20} />}
        // The Toggle Button on the right
        iconRight={
          <button
            type="button"
            onClick={toggleVisibility}
            className="pointer-events-auto cursor-pointer text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon size={20} weight="bold" />
            ) : (
              <EyeIcon size={20} weight="bold" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
