import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: "name" | "password";
}

export default function TextField({ label, field, ...props }: TextFieldProps) {
  return (
    <div className="flex gap-4 items-center">
      <label htmlFor={field} className="w-20">
        {label}
      </label>
      <input
        autoComplete="off"
        className="px-2 py-1 border rounded-md w-60 outline-none"
        {...props}
      />
    </div>
  );
}
