import { Fragment, useState } from "react";
import WebcamCapture from "./components/WebcamCapture";

function App() {
  const [webcamStarted, setWebcamStarted] = useState(false);

  const handleStartWebcam = () => {
    setWebcamStarted(true);
  }

  const handleEndWebcam = () => {
    setWebcamStarted(false);
  }
  return (
    <Fragment>
      {webcamStarted ? (
        <WebcamCapture></WebcamCapture>
      ) : <button onClick={handleStartWebcam}>Start Webcam Capture</button>}
      {webcamStarted && <button onClick={handleEndWebcam}>End Webcam Capture</button>}
    </Fragment>
  );
}

export default App;
