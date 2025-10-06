import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
}) {
  const baseStyles = "rounded px-4 py-2 font-medium focus:outline-none";
  const sizeStyles = {
    small: "text-sm py-1 px-2",
    medium: "text-base py-2 px-4",
    large: "text-lg py-3 px-5",
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
