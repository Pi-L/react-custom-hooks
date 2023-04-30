import { useState } from "react";

/**
 * @typedef UseInputReturn
 * @property {string} value
 * @property {function(InputEvent & {target : HTMLInputElement }): void} onChange
 */

/**
 *
 * @param {string | function(): string } initialValue
 * @returns {UseInputReturn}
 */
export function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    onChange: e => setValue(e.target.value),
  };
}
