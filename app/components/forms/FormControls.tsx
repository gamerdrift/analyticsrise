'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff, Search, Calendar, ChevronDown, Check } from 'lucide-react';

// --- BASE INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, disabled, id, type = 'text', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 rounded border bg-[#05070B] text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#00E5FF] transition-all disabled:opacity-50 disabled:pointer-events-none',
              error ? 'border-[#FF1744] focus:ring-[#FF1744]' : 'border-slate-800 focus:border-[#00E5FF]/50'
            ),
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} role="alert" className="text-[10px] font-mono text-[#FF1744]">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className="text-[9px] font-mono text-slate-500">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- PASSWORD INPUT ---
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          id={inputId}
          type={show ? 'text' : 'password'}
          label={label}
          className="pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute bottom-2.5 right-3 text-slate-500 hover:text-white p-1 focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

// --- TEXTAREA ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, disabled, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 rounded border bg-[#05070B] text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#00E5FF] transition-all disabled:opacity-50 disabled:pointer-events-none min-h-[100px] resize-y',
              error ? 'border-[#FF1744] focus:ring-[#FF1744]' : 'border-slate-800 focus:border-[#00E5FF]/50'
            ),
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <span id={`${textareaId}-error`} role="alert" className="text-[10px] font-mono text-[#FF1744]">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// --- CHECKBOX ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const checkId = id || `check-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label htmlFor={checkId} className={clsx('inline-flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none', disabled && 'opacity-50 pointer-events-none')}>
        <input
          ref={ref}
          id={checkId}
          type="checkbox"
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-4 h-4 rounded border border-slate-800 bg-[#05070B] text-[#00E5FF] focus:ring-0 focus:ring-offset-0 focus:outline-none transition-all accent-[#00E5FF]'
            ),
            className
          )}
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// --- RADIO ---
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, name, disabled, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label htmlFor={radioId} className={clsx('inline-flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none', disabled && 'opacity-50 pointer-events-none')}>
        <input
          ref={ref}
          id={radioId}
          name={name}
          type="radio"
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-4 h-4 rounded-full border border-slate-800 bg-[#05070B] focus:ring-0 focus:ring-offset-0 focus:outline-none transition-all accent-[#00E5FF]'
            ),
            className
          )}
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  }
);
Radio.displayName = 'Radio';

// --- TOGGLE SWITCH ---
interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onCheckedChange, disabled, id }: ToggleProps) {
  const switchId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onCheckedChange(!checked);
    }
  };

  return (
    <div
      className={clsx('flex items-center justify-between gap-4 select-none cursor-pointer', disabled && 'opacity-50 pointer-events-none')}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${switchId}-label`}
    >
      <span id={`${switchId}-label`} className="text-xs text-slate-300">{label}</span>
      <div
        className={clsx(
          'w-10 h-5 rounded-full p-0.5 border border-slate-800 transition-colors',
          checked ? 'bg-[#00E5FF]/20 border-[#00E5FF]/50' : 'bg-[#05070B]'
        )}
      >
        <div
          className={clsx(
            'w-4 h-3.8 rounded-full bg-slate-400 transition-transform duration-150',
            checked && 'translate-x-5 bg-[#00E5FF]'
          )}
        />
      </div>
    </div>
  );
}

// --- NATIVE SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full relative">
        {label && (
          <label htmlFor={selectId} className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            className={twMerge(
              'w-full px-4 py-2.5 rounded border border-slate-800 bg-[#05070B] text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#00E5FF] appearance-none cursor-pointer pr-10',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0D1117]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

// --- SEARCH INPUT ---
export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ id, ...props }, ref) => {
    const searchId = id || `search-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          id={searchId}
          type="text"
          className="pl-10"
          {...props}
        />
        <Search className="absolute bottom-3.5 left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

// --- DATE PICKER INPUT ---
export const DatePicker = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ id, ...props }, ref) => {
    const dateId = id || `date-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          id={dateId}
          type="date"
          className="pl-10 appearance-none"
          {...props}
        />
        <Calendar className="absolute bottom-3.5 left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

// --- MULTI-SELECT CHECKLIST ---
interface MultiSelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({ label, options, selectedValues, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 rounded border border-slate-800 bg-[#05070B] text-slate-200 text-xs font-mono flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {selectedValues.length === 0
            ? 'Select options...'
            : `${selectedValues.length} Selected`}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <ul
            className="absolute top-full left-0 right-0 mt-1 p-2 rounded border border-slate-800 bg-[#0D1117] shadow-xl z-40 max-h-48 overflow-y-auto space-y-1"
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggleOption(opt.value)}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2 rounded text-xs font-mono cursor-pointer select-none transition-all',
                    isSelected ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#00E5FF]" />}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

// --- BUTTONS GROUP ---
interface ButtonGroupProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

export function ButtonGroup({ options, selectedValue, onChange }: ButtonGroupProps) {
  return (
    <div className="inline-flex rounded border border-slate-800 bg-[#05070B] overflow-hidden p-0.5">
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              'px-4 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-all rounded-sm',
              isSelected
                ? 'bg-[#00E5FF] text-black shadow-sm'
                : 'text-slate-400 hover:text-white bg-transparent'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
