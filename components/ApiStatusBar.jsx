import { useApiContext } from "../context/ApiContext";

export const ApiStatusBar = ({
  retryCount = 0,
  maxRetry = 3,
  onReconnect,
  useMock,
  onToggleMock,
}) => {
  const { apiStatus, latency, lastChecked } = useApiContext();

  const formatTime = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="w-full mb-4 px-4 py-3 border border-solid border-gray-100 rounded bg-gray-00 flex items-center justify-between gap-4 flex-wrap">
      <div className="text-sm font-medium">
        {apiStatus === "checking" && (
          <>
            🔄 Checking
            {retryCount > 0 && ` (Retry ${retryCount}/${maxRetry})`}
          </>
        )}
        {apiStatus === "connected" && "🟢 Connected"}
        {apiStatus === "disconnected" && (
          <>
            🔴 Disconnected
            {retryCount > 0 && ` (Tried ${retryCount}/${maxRetry})`}
          </>
        )}
      </div>

      <div className="text-sm">⏱ {latency !== null ? `${latency} ms` : "--"}</div>
      <div className="text-xs text-gray-500">
        Last checked: {formatTime(lastChecked)}
      </div>

      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={onReconnect}
          className="px-2 py-1 border rounded bg-white cursor-pointer text-sm"
        >
          🔁 Reconnect
        </button>
        <button
          type="button"
          onClick={onToggleMock}
          className="px-2 py-1 border rounded bg-white cursor-pointer text-sm"
        >
          {useMock ? "🧪 Mock ON" : "🌐 Real API"}
        </button>
      </div>
    </div>
  );
};
