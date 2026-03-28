import { createContext, useContext, useMemo, useState } from "react";

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const [apiStatus, setApiStatus] = useState("checking");
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const value = useMemo(
    () => ({
      apiStatus,
      latency,
      lastChecked,
      setApiStatus,
      setLatency,
      setLastChecked,
    }),
    [apiStatus, latency, lastChecked],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used inside ApiProvider");
  }
  return context;
};
