import { useEffect, useState } from "react";

export function useDebounce(
  initialValue: string = "",
  delay: number
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [actualValue, setActualValue] = useState(initialValue);
  const [debounceValue, setDebounceValue] = useState(initialValue);

  useEffect(() => {
    const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
    return () => clearTimeout(debounceId);
  }, [actualValue, delay]);

  return [debounceValue, setActualValue];
}
