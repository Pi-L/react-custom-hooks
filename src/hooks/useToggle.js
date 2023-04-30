import { useCallback, useState } from "react";

/**
 *
 * @param {boolean} initialValue
 * @returns {[boolean, () => void]}
 */
export function useToggle(initialValue) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(currentValue => !currentValue), []);

  return [value, toggle];
}
