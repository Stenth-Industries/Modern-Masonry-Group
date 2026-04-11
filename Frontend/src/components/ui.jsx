import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-[var(--bg-secondary)] border border-[var(--text-secondary)]/20 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`bg-[#1E2535]/50 border border-[var(--text-secondary)]/30 rounded-md px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] placeholder-[var(--text-secondary)] transition-colors ${className}`}
    {...props}
  />
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none flex items-center justify-center";
  const variants = {
    primary: "bg-[var(--accent)] hover:bg-[var(--accent-light)] text-[var(--bg-secondary)] shadow-md hover:shadow-[0_0_10px_var(--accent-glow)]",
    outline: "border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10",
    ghost: "text-[var(--text-primary)] hover:bg-white/5"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Select = ({ options = [], value, onChange, placeholder, className = '' }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`appearance-none bg-[#1E2535]/50 border border-[var(--text-secondary)]/30 rounded-md px-4 py-2 pr-8 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] w-full transition-colors ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value || opt} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
          {opt.label || opt.value || opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </div>
  </div>
);
