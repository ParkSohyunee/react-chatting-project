import { useCallback, useState } from "react";

export default function useToggle(initialState?: boolean) {
  const [value, setValue] = useState(initialState || false);

  const handleActive = useCallback(() => {
    setValue(true);
  }, []);

  const handleInActive = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback((prev: boolean) => {
    setValue(!prev);
  }, []);

  return { value, handleActive, handleInActive, toggle };
}
