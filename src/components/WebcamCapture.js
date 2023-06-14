import { Fragment, useState, useEffect, useRef } from "react";
import styles from './WebcamCapture.module.css';
import * as faceapi from 'face-api.js';



const WebcamCapture = (props) => {
    const [webcamEnabled, setWebcamEnabled] = useState(false); //intitial state is false but usestate lets me update this later
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [modelLoaded, setModelLoaded] = useState(false);


    const openMediaDevices = async (constraints) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } //implements media devices interface w/ given constraints (getusermedia triggers the permissions request)
    
    useEffect(() => {
        const loadModel = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelLoaded(true);
        };
      
        loadModel();
      }, []);
      
    useEffect(()=> { //triggers webcam request when the component is first rendered, and because there are no dependencies, this is only tried once
        const enableWebcam = async () => {
            try {
                const mediaStream = await openMediaDevices({'video':true,'audio':false}); //requests video and audio permission in browser
                setStream(mediaStream);
                setWebcamEnabled(true);
                
            } catch(error) {
                console.error('Error accessing media devices.', error);
            }
        }
        enableWebcam();
    },[]);

    //set up videostream of srcObject
    useEffect(() => {
        console.log('Got MediaStream:', stream);
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current && modelLoaded) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks();
            
            // Clear previous drawings
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw face bounding boxes
            faceapi.draw.drawDetections(canvas, detections);
        }
    }
    return (
        <Fragment>
            <div className={styles.webcam}>
                <p>top of video</p>
                {webcamEnabled && <video  ref={videoRef}  autoPlay> 
                </video>}
                <canvas ref={canvasRef} ></canvas>
                <button onClick={captureImage}>Capture Image</button>
                <p>webcam capture</p>
            </div>
        </Fragment>
    );
}

export default WebcamCapture;