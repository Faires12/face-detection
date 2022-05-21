import * as socketio from 'socket.io'
import {Server} from 'http'
import "@tensorflow/tfjs"
import * as blazeface from "@tensorflow-models/blazeface"
import {createCanvas, loadImage, Canvas} from 'canvas'

let model : any;
async function loadModel() {
    model = await blazeface.load()
}
loadModel()

async function predict(canvas : Canvas) {
    return await model.estimateFaces(canvas, false)
     
}

export default function socketConnection(server : Server){
    const io = new socketio.Server(server, { cors: { origin: '*' } });

    io.on("connection", socket => {
        console.log("User connected")

        socket.on("video", img => {
            const canvas = createCanvas(img.width, img.height)
            const ctx = canvas.getContext("2d")
            loadImage(img.data).then(async (image) => {
                ctx.drawImage(image, 0, 0)
                const res = await predict(canvas)
                io.to(socket.id).emit("prediction", res)
            })
            
        })

        socket.on("disconnect", () => {
            console.log("User disconnected")
        })
    })
}