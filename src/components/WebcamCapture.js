import { Fragment, useState, useEffect, useRef } from "react";
import styles from './WebcamCapture.module.css';

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
    }, [stream]);
    

    return (
        <Fragment>
            <div className={styles.webcam}>
                <p>top of video</p>
                {webcamEnabled && <video  ref={videoRef}  autoPlay> 
                </video>}
                
                <p>webcam capture</p>
            </div>
        </Fragment>
    );
}

export default WebcamCapture;