import { cn } from "@/lib/utils";
import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import { forwardRef } from "react";

import type { ComponentPropsWithoutRef, ElementRef } from "react";

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitiveRoot>,
  ComponentPropsWithoutRef<typeof LabelPrimitiveRoot>
>(({ className, ...props }, ref) => (
  <LabelPrimitiveRoot
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));

Label.displayName = LabelPrimitiveRoot.displayName;
