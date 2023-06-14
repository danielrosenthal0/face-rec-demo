import { Fragment, useState, useEffect, useRef } from "react";
import styles from "./WebcamCapture.module.css";
import * as faceapi from "face-api.js";

const WebcamCapture = (props) => {
  const [webcamEnabled, setWebcamEnabled] = useState(false); //intitial state is false but usestate lets me update this later
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoHeight = 480;
  const videoWidth = 640;

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
      console.log("models loaded");
    };
    loadModels();
  }, []);

  const openMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }; //implements media devices interface w/ given constraints (getusermedia triggers the permissions request)

  useEffect(() => {
    //triggers webcam request when the component is first rendered, and because there are no dependencies, this is only tried once
    const enableWebcam = async () => {
      try {
        const mediaStream = await openMediaDevices({
          video: true,
          audio: false,
        }); //requests video and audio permission in browser
        setStream(mediaStream);
        setWebcamEnabled(true);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };
    enableWebcam();
  }, []);

  //set up videostream of srcObject
  useEffect(() => {
    console.log("Got MediaStream:", stream);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    //completely stops video/audio stream in browser when stop button pressed
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setWebcamEnabled(false);
       
      }
      console.log("ended video recording");
    };
  }, [stream]);

  const handleVideoOnPLay = () => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
    }
    const displaySize = {
      width: videoWidth,
      height: videoHeight,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    console.log("canvas created");

        setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const context = canvasRef.current.getContext("2d");
      
            context.clearRect(0, 0, videoWidth, videoHeight);
            faceapi.draw.drawDetections(context, resizedDetections);
            faceapi.draw.drawFaceLandmarks(context, resizedDetections);
            faceapi.draw.drawFaceExpressions(context, resizedDetections);
      
            console.log("detections drawn");
          }, 25);
    
    
  };

  return (
    <Fragment>
      <div className={styles.webcam}>
        {webcamEnabled && modelsLoaded && (
          <div style={{ position: "relative" }}>
            <video autoPlay ref={videoRef} onPlay={handleVideoOnPLay}></video>
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", top: 0, left: 0 }}
            ></canvas>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default WebcamCapture;
