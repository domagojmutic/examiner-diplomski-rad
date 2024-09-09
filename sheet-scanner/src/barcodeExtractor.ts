// import { BrowserMultiFormatReader } from "@zxing/browser";
// import cv from "@techstark/opencv-js";
import { BarcodeDetector } from "barcode-detector";
// import "./style.css";

// let video = document.getElementById("video") as HTMLVideoElement;
// let canvas = document.getElementById("canvasInput") as HTMLCanvasElement;
// let context = canvas.getContext("2d");
// let codeReader = new BrowserMultiFormatReader();

// cv.onRuntimeInitialized = main;

// function main() {
//     document.readyState === "complete"
//         ? getPermission()
//         : window.addEventListener("load", getPermission);

//     function getPermission() {
//         navigator.mediaDevices
//             .getUserMedia({
//                 audio: false,
//                 video: {
//                     facingMode: "environment",
//                 },
//             })
//             .then(function (stream) {
//                 video.srcObject = stream;
//                 video.play();
//                 requestAnimationFrame(scanFrame);
//             })
//             .catch(function (err) {
//                 console.error("Error accessing webcam: " + err);
//             });
//     }

//     function scanFrame() {
//         if (!context) return;
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//         let gray = new cv.Mat();
//         let src = cv.matFromImageData(imageData);

//         // Convert to grayscale
//         cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 4);

//         // Focus on the top right area (approx 25% of the image)
//         let xStart = 0; //canvas.width * 0.75;
//         let yStart = 0;
//         let width = canvas.width; // * 0.25;
//         let height = canvas.height; // * 0.25;

//         let topRightROI = gray.roi(new cv.Rect(xStart, yStart, width, height));

//         // Convert to binary image
//         cv.threshold(topRightROI, topRightROI, 128, 255, cv.THRESH_BINARY);

//         // Find contours to identify potential barcodes
//         let contours = new cv.MatVector();
//         let hierarchy = new cv.Mat();
//         cv.findContours(
//             topRightROI,
//             contours,
//             hierarchy,
//             cv.RETR_EXTERNAL,
//             cv.CHAIN_APPROX_SIMPLE
//         );

//         for (let i = 0; i < contours.size(); i++) {
//             let contour = contours.get(i);
//             let rect = cv.boundingRect(contour);

//             // Extract the possible barcode region
//             let barcodeRegion = topRightROI.roi(
//                 new cv.Rect(rect.x, rect.y, rect.width, rect.height)
//             );

//             cv.imshow("canvasOutput", barcodeRegion);

//             // Convert the barcode region to a data URL
//             let barcodeCanvas = document.createElement("canvas");
//             barcodeCanvas.width = rect.width;
//             barcodeCanvas.height = rect.height;

//             cv.imshow(barcodeCanvas, barcodeRegion);

//             // Convert the temporary canvas to a data URL
//             let barcodeDataUrl = barcodeCanvas.toDataURL("image/png");

//             // Use @zxing/browser to decode the barcode
//             codeReader
//                 .decodeFromImageUrl(barcodeDataUrl)
//                 .then((result) => {
//                     console.log("Detected barcode:", result.getText());
//                     alert("Detected barcode: " + result.getText());
//                 })
//                 .catch(() => {
//                     console.log("No barcode detected in this region.");
//                 });

//             !barcodeRegion.isDeleted() ? barcodeRegion.delete() : null;
//         }

//         // Cleanup
//         !topRightROI.isDeleted() ? topRightROI.delete() : null;
//         !topRightROI.isDeleted() ? topRightROI.delete() : null;
//         !gray.isDeleted() ? gray.delete() : null;
//         !src.isDeleted() ? src.delete() : null;
//         !contours.isDeleted() ? contours.delete() : null;
//         !hierarchy.isDeleted() ? hierarchy.delete() : null;

//         requestAnimationFrame(scanFrame);
//     }
// }

export async function getBarcodeData(image: ImageData | undefined) {
    const barcodeDetector: BarcodeDetector = new BarcodeDetector();

    const barcode = await barcodeDetector.detect(image);
    return barcode;
}
