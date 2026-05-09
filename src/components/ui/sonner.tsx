"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

/** Light toasts — body text is globally white so theme tokens are unreliable. */
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group [--normal-bg:white] [--normal-text:#0f172a] [--normal-border:#e2e8f0]"
    {...props}
  />
)

export { Toaster }
