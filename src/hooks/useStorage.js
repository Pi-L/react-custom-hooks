import { useCallback, useEffect, useState } from "react";

/**
 *
 * @param {string} key
 * @param {any | (() => any)} initialVal
 * @param {Storage} storageObject
 * @returns {any | (() => any)}
 */
const getFromStorage = (key, initialVal, storageObject) => {
  const lsVal = storageObject.getItem(key);
  return lsVal ? JSON.parse(lsVal) : initialVal;
};

/**
 *
 * @param {string} key
 * @param {any | (() => any)} initialValue
 * @param {Storage} storageObject
 * @returns {[any, (any) => void]}
 */
function useStorage(key, initialValue, storageObject) {
  const [value, setValue] = useState(getFromStorage(key, initialValue, storageObject));

  const setInLocalStorage = useCallback(val => storageObject.setItem(key, JSON.stringify(val)), [key, storageObject]);

  useEffect(() => {
    if (value != null) setInLocalStorage(value);
    else storageObject.remove(key);
  }, [key, setInLocalStorage, storageObject, value]);

  return [value, setValue];
}

/**
 *
 * @param {string} key
 * @param {any | (() => any)} initialValue
 * @returns {[any, (any) => void]}
 */
export function useLocalStorage(key, initialValue) {
  return useStorage(key, initialValue, window.localStorage);
}

/**
 *
 * @param {string} key
 * @param {any | (() => any)} initialValue
 * @returns {[any, (any) => void]}
 */
export function useSessionStorage(key, initialValue) {
  return useStorage(key, initialValue, window.sessionStorage);
}
