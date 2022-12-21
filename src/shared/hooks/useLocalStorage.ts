import React, { useState } from "react";

function useLocalStorage(key: string, value?: string) {
  const [item, _setItem] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return value;
    const stored = window.localStorage.getItem(key);
    return stored ?? value;
  });

  const setItem = (value: string) => {
    _setItem(value);
    window.localStorage.setItem(key, value);
  };

  return [item, setItem] as const;
}

export default useLocalStorage;
