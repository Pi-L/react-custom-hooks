import { useEffect, useState } from "react";

export const useElementVisible = ({ ref = null, parentRef = null, options = null } = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [wasVisible, setWasVisible] = useState(false);

  options ??= { root: parentRef, threshold: [0.05, 0.06, 0.1, 0.15, 0.2] };

  const callbackFunction = entries => {
    const [entry] = entries;
    const isIntersecting = entry.intersectionRatio >= 0.05;
    setIsVisible(isIntersecting);
    if (!wasVisible && isIntersecting) setWasVisible(true);
  };

  useEffect(() => {
    let observer;
    if (ref?.current) {
      observer = new IntersectionObserver(callbackFunction, options);
      observer.observe(ref.current);
    }

    return () => {
      if (!!ref?.current && !!observer) observer.unobserve(ref.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return { isVisible, wasVisible };
};
