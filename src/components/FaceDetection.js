import { useOpenCv } from "opencv-react";
import { useEffect } from "react";

const FaceDetection = (props) => {
  const { loaded, cv } = useOpenCv();

  useEffect(() => {
    const detectFaces = async () => {
      if (!loaded) {
        //if opencv has not loaded, do not start face detection
        return;
      }

      //load face detection model
      const faceCascade = new cv.CascadeClassifier();
      const modelPath = "../models/haarcascade_frontalface_default.xml";
      await faceCascade.load(modelPath);
      console.log("face cascade loaded");

      //face detection
      const videoElement = document.getElementById("video-element");
      const src = new cv.Mat(
        videoElement.height,
        videoElement.width,
        cv.CV_8UC4
      );
      const gray = new cv.Mat();
      const faces = new cv.RectVector();
      const faceColor = new cv.Scalar(255, 0, 0); // BGR color format (blue)

      const processVideo = () => {
        try {
          const cap = new cv.VideoCapture(videoElement);
          cap.read(src);
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
          cv.equalizeHist(gray, gray);
          faceCascade.detectMultiScale(gray, faces);

          for (let i = 0; i < faces.size(); i++) {
            const faceRect = faces.get(i);
            const point1 = new cv.Point(faceRect.x, faceRect.y);
            const point2 = new cv.Point(
              faceRect.x + faceRect.width,
              faceRect.y + faceRect.height
            );
            cv.rectangle(src, point1, point2, faceColor, 2);
          }

          // Display the processed video frame
          cv.imshow("canvas", src);

          // Request the next frame
          requestAnimationFrame(processVideo);
        } catch (error) {
          console.error("Error processing video:", error);
        }
      };

      processVideo();
    };
    detectFaces();
  }, [loaded, cv]);
  return <canvas id="canvas"></canvas>;

};

export default FaceDetection;
