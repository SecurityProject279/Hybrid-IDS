import React, { useState } from 'react';
import './App.css';


// PASTE YOUR NGROK URL HERE
const API_URL = "https://synthia-unhunted-unctuousnessly.ngrok-free.dev/process";


function App() {
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    let featureList;
    try {
      featureList = JSON.parse(features);
    } catch (e) {
      setError("Error: Input is not a valid JSON list. Make sure to include the [ and ] brackets.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "data": featureList 
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.pred);

    } catch (e) {
      setError(`Request Failed: ${e.message}. Is your Colab notebook still running?`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Network Intrusion Detection System</h2>
        <p>Paste your 74-feature list below (including [ and ] brackets):</p>

        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="[112645566.0, 3.0, 0.1, ...]"
          rows={10}
          cols={80}
        />

        <button onClick={handlePredict} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Predict'}
        </button>

        {result && (
          <h3 style={{ color: result === 'Attack' ? '#ff6b6b' : '#6bff6b' }}>
            Prediction: {result}
          </h3>
        )}

        {error && (
          <p style={{ color: '#ff6b6b' }}>{error}</p>
        )}

      </header>
    </div>
  );
}

export default App;
