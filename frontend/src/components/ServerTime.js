import { useEffect, useState } from "react";
import "./ServerTime.css";

function ServerTime({ apiUrl }) {
  const [serverTime, setServerTime] = useState("");

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch(`${apiUrl}/server_time`);
        const data = await response.json();
        setServerTime(data.server_time);
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    fetchServerTime();
    const interval = setInterval(fetchServerTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [apiUrl]);

  if (!serverTime) return null;

  return (
    <div className="server-time">
      Server Time: {new Date(serverTime).toLocaleString()}
    </div>
  );
}

export default ServerTime;
