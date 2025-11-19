import { ChangeEvent, InputHTMLAttributes } from "react";
import styles from "./DynamicInput.module.css";

interface DynamicInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function DynamicInput({
  type = "text",
  id,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  autoComplete = "off",
  required = false,
  className = "",
  ...restProps
}: DynamicInputProps) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      required={required}
      className={`${styles.dynamicInput} ${className}`}
      {...restProps}
    />
  );
}

export default DynamicInput;
