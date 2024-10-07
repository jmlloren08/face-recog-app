import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';

export default function FaceRecognition() {

    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    // const [dialogOpen, setDialogOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const toast = useRef(null);

    const euclideanDistance = (point1, point2) => {
        const xDist = point1._x - point2._x;
        const yDist = point1._y - point2._y;
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    const calculateEAR = (eye) => {
        if (eye && eye.length === 6) {
            // vertical distances between points (1,5) and (2,4)
            const dist1 = euclideanDistance(eye[1], eye[5]);
            const dist2 = euclideanDistance(eye[2], eye[4]);
            // horizontal distance between points (0,3)
            const dist3 = euclideanDistance(eye[0], eye[3]);
            if (dist3 !== 0) {
                const ear = (dist1 + dist2) / (2.0 * dist3);
                return ear;
            } else {
                console.error('Horizontal distance (0-3) is zero, cannot calculate EAR.');
            }
        } else {
            console.error('Invalid eye landmarks data.');
            return NaN;
        }
    }

    const BLINK_THRESHOLD = 0.30;

    useEffect(() => {
        const runFaceRecognition = async () => {
            try {
                // turn on camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
                // get video ref from stream
                videoRef.current.srcObject = stream;
                // load models from public/models folder
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('./models')
                ]);
                // load labeled images
                const labeledFaceDescriptors = await loadLabeledImages();
                if (labeledFaceDescriptors.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No valid images found',
                        text: 'Please register your face first!',
                        showConfirmButton: true
                    });
                    stopScanning();
                }
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);
                // start face recognition on an interval
                intervalRef.current = setInterval(async () => {
                    // detect faces and landmarks
                    let detections = await faceapi.detectAllFaces(videoRef.current)
                        .withFaceLandmarks()
                        .withFaceDescriptors();

                    // ensure canvas follow video elements
                    const canvas = canvasRef.current;
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;

                    const displaySize = {
                        width: videoRef.current.videoWidth,
                        height: videoRef.current.videoHeight
                    }

                    faceapi.matchDimensions(canvas, displaySize);
                    // resize the detections to match the video size
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    // clear previous drawing on the canvas
                    const context = canvas.getContext('2d');
                    context.setTransform(-1, 0, 0, 1, canvas.width, 0); // Flip horizontally
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    // draw the detections on the canvas
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    // draw the landmarks on the canvas
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                    // check if any face is detected
                    if (detections.length === 0) {
                        // no face detected
                        return;
                    }
                    // process detection to find a match
                    for (const detection of detections) {
                        // get landmark from left and right eye
                        const leftEye = detection.landmarks.getLeftEye();
                        const rightEye = detection.landmarks.getRightEye();
                        // calculate left and right eye EAR
                        const leftEAR = calculateEAR(leftEye);
                        const rightEAR = calculateEAR(rightEye);
                        // log the EAR values
                        // console.log('Left EAR: ', leftEAR);
                        // console.log('Right EAR: ', rightEAR);
                        // check left and right eye blink threshold
                        if (leftEAR < BLINK_THRESHOLD || rightEAR < BLINK_THRESHOLD) {
                            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                            if (bestMatch.label !== 'unknown') {
                                // stop scanning before showing the alert
                                stopScanning();
                                // get employee id and name
                                const employeeId = bestMatch.label;

                                try {
                                    const { attendee_lastname, attendee_firstname, attendee_middlename, attendee_image_path, attendee_pin } = await fetchEmployeeDetails(employeeId);
                                    const promptForPin = async () => {
                                        const result = await Swal.fire({
                                            icon: 'success',
                                            title: `Match found!\n${attendee_lastname}, ${attendee_firstname} ${attendee_middlename.charAt(0)}.`,
                                            imageUrl: `/storage/${attendee_image_path}`,
                                            imageWidth: 200, // Set width
                                            imageHeight: 200, // Set height
                                            imageAlt: 'Attendee Image', // Alternative text for the image
                                            text: 'Please enter your PIN to confirm',
                                            input: 'password',
                                            inputValidator: (value) => {
                                                if (!value) {
                                                    return 'PIN is required';
                                                }
                                            },
                                            showCancelButton: true,
                                            confirmButtonText: 'Confirm',
                                            cancelButtonText: 'Cancel'
                                        });
                                        if (result.isConfirmed) {
                                            if (String(result.value) === String(attendee_pin)) {
                                                const name = `${attendee_lastname}, ${attendee_firstname} ${attendee_middlename}`;
                                                storeTimeInOut(employeeId, name);
                                                storeFaceDataPoints(employeeId, leftEAR, rightEAR);
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Success',
                                                    text: 'PIN confirmed. You have successfully timed in/out.',
                                                    showConfirmButton: true
                                                }).then(() => {
                                                    context.clearRect(0, 0, canvas.width, canvas.height);
                                                });
                                            } else {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: 'Incorrect PIN. Please try again.',
                                                    showConfirmButton: true
                                                }).then(() => {
                                                    promptForPin();
                                                });
                                            }
                                        }
                                    }
                                    promptForPin();
                                } catch (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.message || 'Error fetching employee details',
                                        showConfirmButton: true
                                    });
                                }
                                // exit the loop after handling the first valid detection
                                break;
                            }
                        } else {
                            toast.current.show({
                                severity: 'error',
                                summary: 'NOT MATCH FOUND',
                                detail: 'Please register your face first or try to move closer to the camera.',
                                life: 3000
                            });
                            break;
                        }
                    }
                }, 1000);
            } catch (error) {
                console.error('Error during face recognition setup:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `An error occured: ${error.message}`,
                    showConfirmButton: true
                });
                stopScanning();
            }
        }

        if (scanning) {
            runFaceRecognition();
        }

        return () => {
            clearInterval(intervalRef.current);
        }

    }, [scanning]);

    // function to load labeled images
    const loadLabeledImages = async () => {
        const imageFiles = await getImagesFromFolder();

        return Promise.all(
            imageFiles.map(async (fileName) => {
                try {
                    // fetch the image
                    const img = await faceapi.fetchImage(`/storage/images/${fileName}`);
                    // detect a single face and get the face descriptor
                    const detections = await faceapi.detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    if (detections) {
                        return new faceapi.LabeledFaceDescriptors(fileName.replace('.jpg', ''), [detections.descriptor]);
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Error processing image ${fileName}: ${error.message}`,
                        showConfirmButton: true
                    });
                    return null;
                }
            })
        ).then((results) => results.filter(Boolean));
    }
    // Function to fetch image filenames
    const getImagesFromFolder = async () => {
        try {
            const response = await axios.get('/get-images');
            return response.data;
        } catch (error) {
            console.error('Error fetching image filenames:', error);
            return [];
        }
    }
    // function to handle time in/out data submission
    const storeTimeInOut = async (employeeId, employeeName) => {
        const currentTime = new Date();
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        try {
            const response = await axios.post('/store-time-in-out', {
                employee_id: employeeId,
                employee_name: employeeName,
                time_in_out: formattedTime
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message,
                showConfirmButton: true
            });
        }
    }

    const storeFaceDataPoints = async (employeeId, leftEAR, rightEAR) => {
        try {
            const response = await axios.post('/store-facial-data-points', {
                employee_id: employeeId,
                leftEAR: leftEAR,
                rightEAR: rightEAR
            });
            return response.data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || 'Error storing face data points',
                showConfirmButton: true
            });
            return null;
        }
    }
    // function to fetch employee name
    const fetchEmployeeDetails = async (employeeId) => {
        try {
            const response = await axios.get(`/get-employee-details/${employeeId}`);
            return response.data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || 'Error fetching employee name',
                showConfirmButton: true
            });
            return null;
        }
    }

    const startScanning = () => {
        setLoading(true);
        setScanning(true);
    }

    const stopScanning = () => {
        clearInterval(intervalRef.current);
        setLoading(false);
        setScanning(false);
    }

    return (
        <div>
            <div style={{ position: 'relative', width: `${videoRef.current?.videoWidth || 640}px`, height: `${videoRef.current?.videoHeight || 480}px` }}>
                <video
                    ref={videoRef}
                    autoPlay
                    className='rounded-lg'
                    style={{ transform: 'scaleX(-1)' }}
                    onLoadedMetadata={() => {
                        // Ensure the canvas matches the video size once the video metadata is loaded
                        if (canvasRef.current) {
                            canvasRef.current.width = videoRef.current.videoWidth;
                            canvasRef.current.height = videoRef.current.videoHeight;
                        }
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
            </div>
            <div className="text-center mt-4 mb-4">
                <Toast ref={toast} />
                <button
                    onClick={startScanning}
                    disabled={loading}
                    className={`rounded-lg border border-primary p-2 text-white transition hover:bg-opacity-90 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'}`}
                >
                    {loading ? 'Scanning...' : 'Start Scanning'}
                </button>
            </div>
        </div>
    );
}