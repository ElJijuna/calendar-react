import { type ChangeEvent, type ReactNode, useId } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectBaseProps {
  options: SelectOption[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: ReactNode;
  className?: string;
}

/** Label + native `<select>`, shared by the year and month selects. */
export const SelectBase = ({ options, value, onChange, label, className }: SelectBaseProps) => {
  const id = useId();

  return (
    <div part="select-container" data-part="select-container" className={className}>
      <label htmlFor={id} part="label" data-part="label">
        {label}
      </label>
      <select id={id} part="select" data-part="select" value={value} onChange={onChange}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            part="option"
            data-part="option"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
