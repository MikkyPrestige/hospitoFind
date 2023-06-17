// Button component

import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button {...props}
      style={{
        backgroundColor: "#08299B",
        padding: ".8rem 1.5rem",
        borderRadius: "1.5rem",
      }}
    >
      {children}
    </button>
  );
}