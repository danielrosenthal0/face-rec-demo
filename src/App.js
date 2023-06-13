import { Fragment, useRef, useState } from "react";
import WebcamCapture from "./components/WebcamCapture";
import FaceDetection from "./components/FaceDetection";

function App() {
  const [webcamStarted, setWebcamStarted] = useState(false);

  const handleStartWebcam = () => {
    setWebcamStarted(true);
  }
  const handleEndWebcam = () => {
    setWebcamStarted(false);
  }

  // const videoRef = useRef(null);

  return (
    <Fragment>
      {webcamStarted ? (
        <WebcamCapture ></WebcamCapture>
      ) : <button onClick={handleStartWebcam}>Start Webcam Capture</button>}
      {webcamStarted && <button onClick={handleEndWebcam}>End Webcam Capture</button>}
      {/* <FaceDetection></FaceDetection> */}
    </Fragment>
  );
}

export default App;
