import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { RequestCacheContext } from "../contexts/RequestCacheContextProvider.jsx";

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {{} & {data: any}=} payload
 */

/**
 * @typedef {[{} & {data?: any, isError: boolean, isLoading: boolean}, ((p: Action) => void)]} ReducerHookSpreadReturn
 */

const ACTIONS = {
  FETCH_INIT: "FETCH_INIT",
  FETCH_START: "FETCH_START",
  FETCH_FROM_CACHE: "FETCH_FROM_CACHE",
  FETCH_REFRESH_CACHE: "FETCH_REFRESH_CACHE",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
};

function fetchReducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.FETCH_START:
      return {
        isError: false,
        isLoading: true,
      };
    case ACTIONS.FETCH_SUCCESS:
      return {
        data: payload.data,
        isError: false,
        isLoading: false,
      };
    case ACTIONS.FETCH_ERROR:
      return {
        isError: true,
        isLoading: false,
      };

    default:
      throw new Error("ActionNotImplemented");
  }
}

const FETCH_TIMEOUT = import.meta.env.VITE_FETCH_TIMEOUT;

/**
 *
 * @param {{} & {url: string, isReadyToFetch: boolean, options: object, mapper: ((any) => any), dataDefault: any}} param0
 * @returns {{} & {data?: any, isError: boolean, isLoading: boolean, refresh: ((url: ?string) => void)}} return
 */
export function useFetch({ url = null, isReadyToFetch = true, options = { timeout: FETCH_TIMEOUT }, mapper = d => d, dataDefault = null }) {
  /** @type {ReducerHookSpreadReturn} */
  const [state, dispatch] = useReducer(fetchReducer, { data: dataDefault, isError: false, isLoading: true });

  const { addToCache, removeFromCache, isInCache, getFromCache } = useContext(RequestCacheContext);
  const [uuidRefresh, setUuidRefresh] = useState(null);

  const refresh = useCallback(
    nextUrl => {
      if (nextUrl) removeFromCache(nextUrl);
      else removeFromCache(url);

      setUuidRefresh(crypto.randomUUID());
    },
    [removeFromCache, url]
  );

  useEffect(() => {
    let controller;

    if (!url || !isReadyToFetch) return;

    if (isInCache(url)) {
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: { data: getFromCache(url) } });
      return;
    }

    dispatch({ type: ACTIONS.FETCH_START });

    controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("TimeoutError"), options.timeout);

    fetch(url, { signal: controller.signal, ...(options ?? {}) })
      .then(async res => {
        clearTimeout(timeoutId);
        if (res?.status && res.status >= 200 && res.status < 400) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then(mapper)
      .then(data => {
        addToCache(url, data);
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: { data } });
      })
      .catch(e => {
        clearTimeout(timeoutId);
        if (e === "CleanUp") return;
        dispatch({ type: ACTIONS.FETCH_ERROR });
      });

    return () => {
      controller?.abort("CleanUp");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isReadyToFetch, uuidRefresh]);

  return { ...state, refresh };
}
