import React from 'react'
import { ButtonProps } from "@/types/ui";

export const Button = ({ children, className, style: inlineStyle, ...props }: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: "var(--color-blue)",
    color: "var(--color-invert)",
    padding: ".5rem 1rem",
    borderRadius: "1.5rem",
    border: "none",
    cursor: "pointer",
    ...inlineStyle
  };

  return (
    <button
      {...props}
      className={className}
      style={baseStyle}
    >
      {children}
    </button>
  )
};