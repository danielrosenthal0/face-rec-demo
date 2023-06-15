import { useState } from "react";
import WebcamCapture from "./components/WebcamCapture";
import styles from './App.module.css';
import Header from "./components/Header";

function App() {
  const [webcamStarted, setWebcamStarted] = useState(false);

  const handleStartWebcam = () => {
    setWebcamStarted(true);
  }

  const handleEndWebcam = () => {
    setWebcamStarted(false);
  }
  return (
    <div className={styles.content}>
      <Header></Header>
      {webcamStarted ? (
        <WebcamCapture></WebcamCapture>
      ) : <button onClick={handleStartWebcam}>Start webcam facial recognition</button>}
      {webcamStarted && <button onClick={handleEndWebcam}>Stop</button>}
    </div>
  );
}

export default App;
