import React from "react";
import { AccessibilityContextProvider } from "./contexts/AccessibilityContextProvider";
import { RequestCacheContextProvider } from "./contexts/RequestCacheContextProvider";
import { Home } from "./pages/Home";

// Inspired by @WebDevSimplified
// https://www.youtube.com/@WebDevSimplified
// https://github.com/WebDevSimplified/useful-custom-react-hooks/tree/main/src

function App() {
  return (
    <RequestCacheContextProvider>
      <AccessibilityContextProvider>
        <Home />
      </AccessibilityContextProvider>
    </RequestCacheContextProvider>
  );
}

export default App;
