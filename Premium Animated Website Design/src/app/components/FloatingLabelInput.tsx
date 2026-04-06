import { useState } from "react";
import { motion } from "motion/react";

interface FloatingLabelInputProps {
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  defaultValue?: string;
}

export function FloatingLabelInput({ label, type, required, defaultValue }: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
  };

  const isFloating = isFocused || hasValue;

  const inputClasses = "w-full px-4 pt-6 pb-2 bg-[var(--off-white)] rounded-xl outline-none border-2 transition-all";

  return (
    <div className="relative">
      <motion.label
        className="absolute left-4 transition-all pointer-events-none text-[var(--slate)]"
        animate={{
          top: isFloating ? '8px' : '50%',
          translateY: isFloating ? '0' : '-50%',
          fontSize: isFloating ? '12px' : '16px',
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-[var(--accent)]"> *</span>}
      </motion.label>

      {type === 'textarea' ? (
        <textarea
          className={`${inputClasses} min-h-32 resize-none`}
          style={{
            borderColor: isFocused ? 'var(--accent)' : 'transparent',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          required={required}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type={type}
          className={inputClasses}
          style={{
            borderColor: isFocused ? 'var(--accent)' : 'transparent',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          required={required}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}
