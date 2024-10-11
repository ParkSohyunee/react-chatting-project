import { ChangeEvent, useState } from "react";

interface UseFormProps<T> {
  initialState: T;
}

export default function useForm<T>({ initialState }: UseFormProps<T>) {
  const [values, setValues] = useState(initialState);

  const handleChangeValues = (
    name: keyof T,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setValues((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const getTextFieldInputProps = (name: keyof T) => {
    const input = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
      handleChangeValues(name, e);

    return { input, onChange };
  };

  return { values, getTextFieldInputProps };
}
