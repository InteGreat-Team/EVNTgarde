import { useState, useEffect, useRef } from "react";

interface AnalyticsOverviewDashboardProps {
  reportId: string;
  embedUrl?: string;
  ctid: string;
  height?: number;
  title: string;
}

const AnalyticsOverviewDashboard = ({
  reportId,
  embedUrl = "https://app.powerbi.com/reportEmbed",
  ctid,
  height = 541.25,
  title,
}: AnalyticsOverviewDashboardProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fullEmbedUrl = `${embedUrl}?reportId=${reportId}&autoAuth=true&ctid=${ctid}`;

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const retryLoading = () => {
    setLoading(true);
    setError(false);
    if (iframeRef.current) {
      iframeRef.current.src = fullEmbedUrl;
    }
  };

  // Check if iframe is actually loaded
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError(true);
      }
    }, 30000); // 30 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [loading]);

  return (
    <>
      {/* Custom styles for spinner animation - assuming Tailwind and fonts are already configured */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
        `}
      </style>

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md relative w-full"
        style={{ height: `${height}px` }}
      >
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white/90 z-10">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-4 border-t-[#d4e157] rounded-full animate-spin-custom mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white p-5 text-center">
            <p className="text-red-500 mb-4">
              There was an error loading the dashboard. Please try again later.
            </p>
            <button
              onClick={retryLoading}
              className="bg-[#d4e157] text-[#2c3e50] border-none px-4 py-2 rounded cursor-pointer font-medium hover:bg-[#c2d13a]"
            >
              Retry
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title={title}
          width="100%"
          height={height}
          src={fullEmbedUrl}
          allowFullScreen={true}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className={`block w-full h-full border-none ${
            loading || error ? "hidden" : "block"
          }`}
        ></iframe>
      </div>
    </>
  );
};

export default AnalyticsOverviewDashboard;
