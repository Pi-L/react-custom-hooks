import React, { useEffect, useState } from "react";

export const AccessibilityContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
export function AccessibilityContextProvider({ children }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHigherContrast, setIsHigherContrast] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsHigherContrast(window.matchMedia("(prefers-contrast: more)").matches || window.matchMedia("(forced-colors: active)").matches);
  }, []);

  return <AccessibilityContext.Provider value={{ isHigherContrast, isReducedMotion }}>{children}</AccessibilityContext.Provider>;
}
