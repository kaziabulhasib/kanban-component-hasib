import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const variantStyles = {
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "px-4 py-2 text-sm rounded-lg transition",
        variantStyles[variant],

        disabled && "opacity-50 cursor-not-allowed hover:none hover:bg-inherit",

        className
      )}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
