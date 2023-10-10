import "./styles.css";
import { useEffect, useState } from "react";

// Step 2:
// const list = document.querySelectorAll('code > div[data-tag] > span[data-id] > i');
// const link = [...list].map((tag) => tag.getAttribute('value')).join('')

const useFetchOnce = (url: string) => {
  // overkill, but it's the only way to make sure it runs once in strict mode
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!data) {
      fetch(url)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`${resp.status}, ${resp.statusText}`);
          }
          return resp.text();
        })
        .then((text) => {
          setData(text);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [url, data]);
  return { data, isLoading, error };
};

export default function App() {
  const [message, setMessage] = useState("");
  const { isLoading, data, error } = useFetchOnce(
    "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/737562"
  );

  /* typewriter effect */
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        timeout = setTimeout(
          () => setMessage((msg) => msg + data[i]),
          i * 500 + 500
        );
      }
    }
    return () => {
      setMessage("");
      clearTimeout(timeout);
    };
  }, [data]);

  return (
    <div className="App">
      {isLoading && "Loading..."}
      {message && (
        <ul>
          {message.split("").map((char, i) => (
            <li key={i}>{char}</li>
          ))}
        </ul>
      )}
      {error && "Error: Could not load 😓"}
    </div>
  );
}
