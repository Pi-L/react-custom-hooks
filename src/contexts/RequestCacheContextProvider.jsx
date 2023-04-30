import React, { useCallback, useState } from "react";

export const RequestCacheContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
export function RequestCacheContextProvider({ children }) {
  const [cache, setCache] = useState(new Map());

  const addToCache = useCallback((key, value) => setCache(curr => new Map(curr.set(key, value))), []);
  const removeFromCache = useCallback(
    key => {
      if (!cache.has(key)) return;
      setCache(curr => {
        const next = new Map(curr);
        next.delete(key);
        return next;
      });
    },
    [cache]
  );
  const isInCache = useCallback(key => cache.has(key), [cache]);
  const getFromCache = useCallback(key => cache.get(key), [cache]);

  return (
    <RequestCacheContext.Provider value={{ addToCache, removeFromCache, isInCache, getFromCache }}>{children}</RequestCacheContext.Provider>
  );
}
