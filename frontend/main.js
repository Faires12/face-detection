const socket = io("http://localhost:3000")

const videoElem = document.querySelector("video")
const canvasBox = document.querySelector("canvas")
const canvasElem = document.createElement("canvas")
let videoPlaying = false

function initVideo(){
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        videoElem.srcObject = stream
        videoElem.play()
        videoPlaying = true
    })
    .catch(err => console.log(err))
}
initVideo()

videoElem.addEventListener("loadeddata", () => {
    canvasElem.width = videoElem.videoWidth
    canvasElem.height = videoElem.videoHeight
    canvasBox.width = videoElem.videoWidth
    canvasBox.height = videoElem.videoHeight
    if(videoPlaying)
        setInterval(sendVideo, 300) 
})

function sendVideo(){
    let ctx = canvasElem.getContext("2d")
    ctx.drawImage(videoElem, 0, 0)
    socket.emit("video", {
        data: canvasElem.toDataURL(),
        width: canvasElem.width,
        height: canvasElem.height
    })
}

function drawBoxes(preds){
    const ctx = canvasBox.getContext("2d")

    ctx.clearRect(0, 0, canvasBox.width, canvasBox.height)
    ctx.beginPath()
    ctx.strokeStyle = "#FF0000"

    for(let i in preds){
        ctx.rect(preds[i].topLeft[0], preds[i].topLeft[1], preds[i].bottomRight[0] - preds[i].topLeft[0],
            preds[i].bottomRight[1] - preds[i].topLeft[1])
    }
    ctx.stroke()
}

socket.on("prediction", preds => {
    console.log(preds)
    drawBoxes(preds)
})



