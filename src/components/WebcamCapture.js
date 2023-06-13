import { Fragment, useState, useEffect, useRef } from "react";
import styles from './WebcamCapture.module.css';
import axios from "axios";

const WebcamCapture = (props) => {
    const [webcamEnabled, setWebcamEnabled] = useState(false); //intitial state is false but usestate lets me update this later
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    const openMediaDevices = async (constraints) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } //implements media devices interface w/ given constraints (getusermedia triggers the permissions request)
    
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
        //stops video and audio stream when stream is stopped by the user
        return () => {
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            console.log("turning off camera");
          };
    }, [stream]);
    

    const captureImage = () => {
        if (videoRef.current) {
          const canvas = document.createElement("canvas");
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
          const imageData = canvas.toDataURL("image/png");
    
          axios.get("http://localhost:3001/detect", {
            params: {
              image: imageData
            }
          })
          .then(response => {
            console.log("Facial detection result:", response.data);
          })
          .catch(error => {
            console.error("Error performing facial detection:", error);
          });
        }
      };
    return (
        <Fragment>
            <div className={styles.webcam}>
                
                {webcamEnabled && <video  id="video-element" ref={videoRef}  autoPlay style={{ transform: "scaleX(-1)" }}> 
                </video>}
                <button onClick={captureImage}>Capture Image</button>
                
            </div>
        </Fragment>
    );
}

export default WebcamCapture;