import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'default',
  isLoading,
  children,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-background hover:bg-zinc-200 shadow-lg shadow-white/5",
    secondary: "bg-surface text-primary border border-border hover:bg-border",
    ghost: "hover:bg-white/5 text-muted hover:text-primary",
  };
  
  const sizes = {
    default: "h-11 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "h-11 w-11",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
