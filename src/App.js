import { useState } from "react";
import WebcamCapture from "./components/WebcamCapture";
import styles from './App.module.css';
import Header from "./components/Header";
import solo from './assets/solo.png'

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
      ) : <div className={styles.stuff}>
        <img className={styles.guy} src={solo}></img>
        <button onClick={handleStartWebcam}>Start webcam facial recognition</button>
        </div>}
      {webcamStarted && <button onClick={handleEndWebcam}>Stop</button>}
    </div>
  );
}

export default App;
