"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketio = __importStar(require("socket.io"));
require("@tensorflow/tfjs");
const blazeface = __importStar(require("@tensorflow-models/blazeface"));
const canvas_1 = require("canvas");
let model;
function loadModel() {
    return __awaiter(this, void 0, void 0, function* () {
        model = yield blazeface.load();
    });
}
loadModel();
function predict(canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield model.estimateFaces(canvas, false);
    });
}
function socketConnection(server) {
    const io = new socketio.Server(server, { cors: { origin: '*' } });
    io.on("connection", socket => {
        console.log("User connected");
        socket.on("video", img => {
            const canvas = (0, canvas_1.createCanvas)(img.width, img.height);
            const ctx = canvas.getContext("2d");
            (0, canvas_1.loadImage)(img.data).then((image) => __awaiter(this, void 0, void 0, function* () {
                ctx.drawImage(image, 0, 0);
                const res = yield predict(canvas);
                io.to(socket.id).emit("prediction", res);
            }));
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
exports.default = socketConnection;
