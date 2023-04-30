import { useCallback, useState } from "react";

/**
 * @typedef UseArrayReturn
 * @property {any[]} array
 * @property {function(any[]): void} set
 * @property {function(any): void} push
 * @property {function(any): void} shift
 * @property {function(number, any): void} replace
 * @property {function(function(any): boolean): void} filter
 * @property {function(number): void} remove
 * @property {function(): void} clear
 * @property {function(): void} reset
 */

/**
 *
 * @param {any[] | function(): any[] } initialArray
 * @returns {UseArrayReturn}
 */
export function useArray(initialArray = []) {
  const [array, setArray] = useState(initialArray);

  const push = useCallback(el => setArray(currArr => [...currArr, el]), []);
  const shift = useCallback(el => setArray(currArr => [el, ...currArr]), []);
  const replace = useCallback((index, el) => setArray(currArr => [...currArr.slice(0, index), el, ...currArr.slice(index + 1)]), []);
  const filter = useCallback(funct => setArray(currArr => currArr.filter(funct)), []);
  const remove = useCallback(index => setArray(currArr => currArr.filter((_, i) => i !== index)), []);
  const clear = useCallback(() => setArray([]), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setArray(initialArray), []);

  return { array, set: setArray, push, shift, replace, filter, remove, clear, reset };
}
