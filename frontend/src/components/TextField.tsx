import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: "name" | "password";
}

export default function TextField({ label, field, ...props }: TextFieldProps) {
  return (
    <div className="mt-4 flex gap-4 items-center">
      <label htmlFor={field} className="w-24 font-semibold text-lg text-center">
        {label}
      </label>
      <input
        autoComplete="off"
        className="w-full px-2 py-1 border rounded-md outline-none text-slate-800 text-lg placeholder:text-sm"
        {...props}
      />
    </div>
  );
}
