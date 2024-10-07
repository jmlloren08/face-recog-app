const loadImagesFromFolder = async (folderPath) => {
    const response = await fetch('/images')
    const imageFiles = await response.json()
    const labeledFaceDescriptors = []
    for (const file of imageFiles) {
        const img = await faceapi.fetchImage(`${folderPath}/${file}`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        if (detections) {
            const faceDescriptors = detections.descriptor
            const label = file.split('.')[0]
            labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [faceDescriptors]))
        }
    }
    return labeledFaceDescriptors
}
const run = async () => {
    //loading the models is going to use await
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })
    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream
    //we need to load our models
    // pre-trained machine learning for our facial detection!s
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ])
    //make the canvas the same size and in the same location
    // as our video feed
    const canvas = document.getElementById('canvas')
    canvas.style.left = videoFeedEl.offsetLeft
    canvas.style.top = videoFeedEl.offsetTop
    canvas.height = videoFeedEl.height
    canvas.width = videoFeedEl.width
    // load images and their face descriptors from the folder
    const labeledFaceDescriptors = await loadImagesFromFolder('./images')
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
    // facial detection with points
    const intervalId = setInterval(async () => {
        // check if found else continue
        // get the video feed and hand it to detectAllFaces method
        let faceAIData = await faceapi.detectAllFaces(videoFeedEl).withFaceLandmarks().withFaceDescriptors().withAgeAndGender().withFaceExpressions()
        // draw on our face/canvas
        //first, clear the canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // draw our bounding box
        faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl)
        faceapi.draw.drawDetections(canvas, faceAIData)
        faceapi.draw.drawFaceLandmarks(canvas, faceAIData)
        faceapi.draw.drawFaceExpressions(canvas, faceAIData)
        // ask AI to guess age and gender with confidence level
        faceAIData.forEach(face => {
            const { detection, descriptor } = face
            const bestMatch = faceMatcher.findBestMatch(descriptor)
            const label = bestMatch.label
            let options = { label: label }
            if (label === 'unknown') {
                options = { label: 'Uknown subject...' }
                console.log('No match found')
            } else {
                console.log(`Match found: ${label}`)
            }
            const drawBox = new faceapi.draw.DrawBox(detection.box, options)
            drawBox.draw(canvas)
        })
    }, 200)
}
run()