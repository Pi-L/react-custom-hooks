import { RequestCacheContext } from "contexts/RequestCacheContextProvider";
import { useCallback, useContext, useEffect, useState } from "react";

const FETCH_TIMEOUT = 30000;

export function useFetch({
  url = "",
  isReadyToFetch = true,
  options = { timeout: FETCH_TIMEOUT },
  mapper = d => d,
  dataDefault = null,
} = {}) {
  const [data, setData] = useState(dataDefault);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uuidRefresh, setUuidRefresh] = useState(null);
  const { addToCache, removeFromCache, isInCache, getFromCache } = useContext(RequestCacheContext);

  const refresh = useCallback(() => {
    removeFromCache(url);
    setUuidRefresh(crypto.randomUUID());
  }, [removeFromCache, url]);

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);

    let controller;
    if (!!url && isReadyToFetch) {
      if (isInCache(url)) {
        setData(getFromCache(url));
        setIsLoading(false);
        return;
      }

      controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort("TimeoutError"), options.timeout);

      fetch(url, { signal: controller.signal, ...(options ?? {}) })
        .then(res => {
          clearTimeout(timeoutId);
          if (res?.status && res.status >= 200 && res.status < 400) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then(mapper)
        .then(d => {
          addToCache(url, d);
          setData(d);
        })
        .catch(e => {
          clearTimeout(timeoutId);
          if (e === "CleanUp") return;
          setIsError(true);
        })
        .finally(() => {
          if (controller?.signal?.aborted && controller.signal.reason === "CleanUp") return;
          setIsLoading(false);
        });
    }

    return () => {
      controller?.abort("CleanUp");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isReadyToFetch, uuidRefresh]);

  return { data, isError, isLoading, refresh };
}
