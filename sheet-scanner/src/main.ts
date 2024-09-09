import cv from "@techstark/opencv-js";
import "./style.css";
import { extractPaper, highlightPaper } from "./jscanify";
import { getBarcodeData } from "./barcodeExtractor";

const video = document.getElementById("video") as HTMLVideoElement;
const canvasOverlay = document.getElementById(
    "canvasOverlay"
) as HTMLCanvasElement;
const ctxOverlay = canvasOverlay.getContext("2d");

let videoInterval: NodeJS.Timeout | string | number | undefined;

cv.onRuntimeInitialized = main;

function main() {
    document.readyState === "complete"
        ? getPermission()
        : window.addEventListener("load", getPermission);

    function getPermission() {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "environment",
                },
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();

                video.addEventListener("loadedmetadata", startScanning, {
                    capture: false,
                    once: true,
                });
            })
            .catch(function (err) {
                console.error("Error accessing webcam: " + err);
            });
    }

    function startScanning() {
        canvasOverlay.width = video.videoWidth;
        canvasOverlay.height = video.videoHeight;

        console.log(canvasOverlay.width, canvasOverlay.height);

        videoInterval = setInterval(async () => {
            if (!ctxOverlay) return;
            ctxOverlay.drawImage(
                video,
                0,
                0,
                canvasOverlay.width,
                canvasOverlay.height
            );
            const borderCanvas = highlightPaper(canvasOverlay);
            ctxOverlay.drawImage(borderCanvas, 0, 0);
            const resultCanvas = extractPaper(canvasOverlay, 595, 842);
            if(await checkPage(resultCanvas)) stopScanning();
        }, 10);
    }

    function stopScanning() {
        clearInterval(videoInterval);
    }

    async function checkPage(canvas: HTMLCanvasElement) {
        const topBarcode = await getBarcodeData(
            canvas
                .getContext("2d")
                ?.getImageData(0, 0, canvas.width, canvas.height)
        );

        if(topBarcode.length > 0) {
            console.log(topBarcode)
            return true
        }
        return false
    }
}
