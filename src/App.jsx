import React from "react";
import { AccessibilityContextProvider } from "./contexts/AccessibilityContextProvider";
import { RequestCacheContextProvider } from "./contexts/RequestCacheContextProvider";

// https://github.com/WebDevSimplified/useful-custom-react-hooks/tree/main/src

function App() {
  return (
    <RequestCacheContextProvider>
      <AccessibilityContextProvider>
        <header>
          <h1>Custom Hooks</h1>
        </header>
      </AccessibilityContextProvider>
    </RequestCacheContextProvider>
  );
}

export default App;
