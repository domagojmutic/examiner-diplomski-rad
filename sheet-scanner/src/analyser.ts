import { BrowserMultiFormatReader } from "@zxing/browser";
import cv from "@techstark/opencv-js";
import AR from "./js-aruco/src/aruco";
import "./style.css";

const img = document.getElementById("rawImg") as HTMLImageElement;
const barcodeData = document.getElementById("barcodeData") as HTMLSpanElement;
const codeReader = new BrowserMultiFormatReader();

const cvLoaded = new Promise((resolve) => {
    cv.onRuntimeInitialized = () => {
        resolve(true);
    };
});

window.addEventListener("load", () => {
    img.src = "/uploads/" + window.location.hash.substring(1);

    img.onload = async () => {
        await Promise.all([scanBarcode(img, true), separateQuestions(img, true)]);

        const doneIndicator = document.createElement("div");
        doneIndicator.id = "done";
        document.body.appendChild(doneIndicator);
    };
});

async function scanBarcode(imgElement: HTMLImageElement, showWork?: boolean) {
    await cvLoaded;

    const results = [];

    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = imgElement.width;
    imgCanvas.height = imgElement.height;

    const imgContext = imgCanvas.getContext("2d");
    if (!imgContext) throw Error("Expected image context to be defined");

    imgContext.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    const imgData = imgContext.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height
    );

    const src = cv.matFromImageData(imgData);
    const srcDecode = new cv.Mat();

    // Grayscale
    cv.cvtColor(src, srcDecode, cv.COLOR_RGB2GRAY, 0);

    if (showWork === true) {
        addCanvas(srcDecode, "decodeGray", "Decode - Grayscale");
    }

    // Resize
    cv.resize(srcDecode, srcDecode, new cv.Size(0, 0), 2, 2, cv.INTER_CUBIC);

    if (showWork === true) {
        addCanvas(srcDecode, "decodeDouble", "Decode - Scale");
    }

    // Sharpness
    const sharpKernel = cv.Mat.eye(3, 3, cv.CV_32F);
    sharpKernel.data32F[0] = 0;
    sharpKernel.data32F[1] = -1;
    sharpKernel.data32F[2] = 0;
    sharpKernel.data32F[3] = -1;
    sharpKernel.data32F[4] = 5;
    sharpKernel.data32F[5] = -1;
    sharpKernel.data32F[6] = 0;
    sharpKernel.data32F[7] = -1;
    sharpKernel.data32F[8] = 0;
    cv.filter2D(srcDecode, srcDecode, -1, sharpKernel);

    if (showWork === true) {
        addCanvas(srcDecode, "decodeSharp", "Decode - Sharpness");
    }

    // Threshold
    cv.threshold(srcDecode, srcDecode, 90, 255, cv.THRESH_BINARY);

    if (showWork === true) {
        addCanvas(srcDecode, "decodeThreshold", "Decode - Threshold");
    }

    const srcROI = new cv.Mat();
    // Resize
    cv.resize(src, srcROI, new cv.Size(0, 0), 0.7, 0.7, cv.INTER_CUBIC);

    if (showWork === true) {
        addCanvas(srcROI, "roiResize", "ROI - Resize");
    }

    // Convert to grayscale
    cv.cvtColor(srcROI, srcROI, cv.COLOR_RGB2GRAY, 0);

    if (showWork === true) {
        addCanvas(srcROI, "roiGray", "ROI - Grayscale");
    }

    // Gradient
    const gradX = new cv.Mat();
    cv.Sobel(srcROI, gradX, cv.CV_32F, 1, 0, -1);
    const gradY = new cv.Mat();
    cv.Sobel(srcROI, gradY, cv.CV_32F, 0, 1, -1);

    cv.subtract(gradX, gradY, srcROI);
    cv.convertScaleAbs(srcROI, srcROI);

    if (showWork === true) {
        addCanvas(srcROI, "roiGradient", "ROI - Gradient");
    }

    // Bluer
    cv.blur(srcROI, srcROI, new cv.Size(3, 3));

    if (showWork === true) {
        addCanvas(srcROI, "roiBlur", "ROI - Blur");
    }

    // Threshold
    cv.threshold(srcROI, srcROI, 225, 255, cv.THRESH_BINARY);

    if (showWork === true) {
        addCanvas(srcROI, "roiThreshold", "ROI - Threshold");
    }

    // Morphology
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(15, 5));
    cv.morphologyEx(srcROI, srcROI, cv.MORPH_CLOSE, kernel);

    if (showWork === true) {
        addCanvas(srcROI, "roiMorphology", "ROI - Morphology");
    }

    //Erosion and dilation
    cv.erode(srcROI, srcROI, new cv.Mat(), new cv.Point(-1, -1), 4);
    cv.dilate(srcROI, srcROI, new cv.Mat(), new cv.Point(-1, -1), 4);

    if (showWork === true) {
        addCanvas(srcROI, "roiErosionDilation", "ROI - Erosion and Dilation");
    }

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
        srcROI,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE
    );

    const blackBackground = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

    for (let i = 0; i < contours.size(); i++) {
        if (showWork === true) {
            const color = new cv.Scalar(
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            );
            cv.drawContours(
                blackBackground,
                contours,
                i,
                color,
                1,
                cv.LINE_8,
                hierarchy,
                100
            );
        }

        let contour = contours.get(i);
        let rect = cv.boundingRect(contour);

        // Extract the possible barcode region
        let barcodeRegion = srcDecode.roi(
            new cv.Rect(
                Math.max((rect.x * 20) / 7 - 10, 0),
                Math.max((rect.y * 20) / 7 - 10, 0),
                Math.min(
                    (rect.width * 20) / 7 + 20,
                    srcDecode.cols - (rect.x * 20) / 7
                ),
                Math.min(
                    (rect.height * 20) / 7 + 20,
                    srcDecode.rows - (rect.y * 20) / 7
                )
            )
        );

        const barcodeCanvas = document.createElement("canvas");
        barcodeCanvas.width = rect.width;
        barcodeCanvas.height = rect.height;

        cv.imshow(barcodeCanvas, barcodeRegion);

        const barcodeDataUrl = barcodeCanvas.toDataURL("image/png");

        try {
            // Use @zxing/browser to decode the barcode
            const result = await codeReader.decodeFromImageUrl(barcodeDataUrl);

            if (result && result.getText()) {
                results.push(result.getText());
                addCanvas(barcodeRegion, "barcode", "Barcode");
            }
        } catch (err) {}

        !barcodeRegion.isDeleted() ? barcodeRegion.delete() : null;
    }

    if (showWork === true) {
        addCanvas(blackBackground, "contours", "Contours");
    }

    src.delete();
    srcDecode.delete();
    srcROI.delete();
    gradX.delete();
    gradY.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();

    barcodeData.textContent = JSON.stringify(results);
    return results;
}

function scanGroup(groupImg: cv.Mat) {
    const enhancedSrc = new cv.Mat();
    const markedGroups = []

    // Grayscale
    cv.cvtColor(groupImg, enhancedSrc, cv.COLOR_RGBA2GRAY);

    // Threshold
    cv.threshold(
        enhancedSrc,
        enhancedSrc,
        0,
        255,
        cv.THRESH_BINARY_INV | cv.THRESH_OTSU
    );

    const groupContourList = [];
    const groupContours = new cv.MatVector();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
        enhancedSrc,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i);
        let rect = cv.boundingRect(contour);

        if (
            rect.width >= 20 &&
            rect.height >= 20 &&
            rect.width / rect.height >= 0.9 &&
            rect.width / rect.height <= 1.1
        ) {
            groupContourList.push(contour);
        }
    }

    groupContourList
        .sort((a, b) => {
            return cv.boundingRect(a).x - cv.boundingRect(b).x;
        })
        .forEach((contour) => groupContours.push_back(contour));

    for (let i = 0; i < groupContours.size(); i++) {
        const mask = cv.Mat.zeros(groupImg.rows, groupImg.cols, cv.CV_8UC1);
        cv.drawContours(mask, groupContours, i, new cv.Scalar(255), -1);

        const max = cv.countNonZero(mask);

        cv.bitwise_and(enhancedSrc, enhancedSrc, mask, mask);
        const n = cv.countNonZero(mask);

        if (n / max > 0.5) markedGroups.push(i);
    }

    if(markedGroups.length === 1) {
        return `${markedGroups[0]}`
    }
}

async function separateQuestions(
    imgElement: HTMLImageElement,
    showWork?: boolean
) {
    await cvLoaded;

    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = imgElement.width;
    imgCanvas.height = imgElement.height;

    const imgContext = imgCanvas.getContext("2d");
    if (!imgContext) throw Error("Expected image context to be defined");

    imgContext.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    const imgData = imgContext.getImageData(
        0,
        0,
        imgCanvas.width,
        imgCanvas.height
    );

    const src = cv.matFromImageData(imgData);

    //Enhance image
    const srcDecode = new cv.Mat();

    cv.cvtColor(src, srcDecode, cv.COLOR_RGB2GRAY, 0);
    const sharpKernel = cv.Mat.eye(3, 3, cv.CV_32F);
    sharpKernel.data32F[0] = 0;
    sharpKernel.data32F[1] = -1;
    sharpKernel.data32F[2] = 0;
    sharpKernel.data32F[3] = -1;
    sharpKernel.data32F[4] = 5;
    sharpKernel.data32F[5] = -1;
    sharpKernel.data32F[6] = 0;
    sharpKernel.data32F[7] = -1;
    sharpKernel.data32F[8] = 0;
    cv.filter2D(srcDecode, srcDecode, -1, sharpKernel);
    cv.resize(srcDecode, srcDecode, new cv.Size(0, 0), 2, 2, cv.INTER_CUBIC);
    cv.threshold(srcDecode, srcDecode, 90, 255, cv.THRESH_BINARY);

    const optCanvas = document.createElement("canvas");
    optCanvas.width = srcDecode.cols;
    optCanvas.height = srcDecode.rows;

    cv.imshow(optCanvas, srcDecode);

    const optContext = optCanvas.getContext("2d");
    if (!optContext) throw Error("Expected image context to be defined");

    const optData = optContext.getImageData(
        0,
        0,
        optCanvas.width,
        optCanvas.height
    );

    // Aruco detection
    const detector = new AR.Detector({
        dictionaryName: "ARUCO",
    });

    const markers = detector.detect(optData);
    // Sort markers by id and remove duplicates
    const markersFiltered = markers
        .sort((a, b) => a.id - b.id)
        .filter(function (item, pos, ary) {
            return !pos || item.id != ary[pos - 1].id;
        });

    markersFiltered.forEach((marker, index) => {
        if (showWork === true) {
            // Show found markers
            for (let i = 0; i < marker.corners.length; i++) {
                let corner: { x: number; y: number } = marker.corners[i];
                let nextCorner: { x: number; y: number };
                if (i + 1 < marker.corners.length)
                    nextCorner = marker.corners[i + 1];
                else nextCorner = marker.corners[0];

                cv.line(
                    src,
                    new cv.Point(corner.x / 2, corner.y / 2),
                    new cv.Point(nextCorner.x / 2, nextCorner.y / 2),
                    [0, 255, 0, 255]
                );
            }
        }

        if (index + 1 < markersFiltered.length) {
            if (parseInt(marker.id) === 1000 && parseInt(markersFiltered[index + 1].id) === 1001) {
                const firstPoint = getMarkerPoint(
                    marker.corners,
                    "middleBottom"
                );
                const secondPoint = getMarkerPoint(
                    markersFiltered[index + 1].corners,
                    "middleTop"
                );

                if (showWork === true) {
                    cv.rectangle(
                        src,
                        new cv.Point(firstPoint.x / 2, firstPoint.y / 2),
                        new cv.Point(secondPoint.x / 2, secondPoint.y / 2),
                        [0, 0, 255, 255]
                    );
                }

                const groupROI = src.roi(
                    new cv.Rect(
                        firstPoint.x / 2,
                        firstPoint.y / 2,
                        secondPoint.x / 2 - firstPoint.x / 2,
                        secondPoint.y / 2 - firstPoint.y / 2
                    )
                );

                const group = scanGroup(groupROI)

                addCanvas(groupROI, "group", group);

                groupROI.delete();
            } else if (marker.id + 1 !== markersFiltered[index + 1].id) {
                console.log("Could not find next marker. Skipping...");
            } else {
                let firstPosition = "middle"; //"bottom";
                let secondPosition = "middle"; //"top";
                if (marker.id % 2 === 0) {
                    firstPosition += "Right";
                    secondPosition += "Left";
                } else {
                    firstPosition += "Left";
                    secondPosition += "Right";
                }
                const firstPoint = getMarkerPoint(
                    marker.corners,
                    firstPosition as
                        | "bottomRight"
                        | "bottomLeft"
                        | "topRight"
                        | "topLeft"
                        | "middleRight"
                        | "middleLeft"
                        | "middle"
                );
                const secondPoint = getMarkerPoint(
                    markersFiltered[index + 1].corners,
                    secondPosition as
                        | "bottomRight"
                        | "bottomLeft"
                        | "topRight"
                        | "topLeft"
                        | "middleRight"
                        | "middleLeft"
                        | "middle"
                );

                if (showWork === true) {
                    cv.rectangle(
                        src,
                        new cv.Point(firstPoint.x / 2, firstPoint.y / 2),
                        new cv.Point(secondPoint.x / 2, secondPoint.y / 2),
                        [0, 0, 255, 255]
                    );
                }

                const questionROI =
                    marker.id % 2 === 0
                        ? src.roi(
                              new cv.Rect(
                                  firstPoint.x / 2,
                                  firstPoint.y / 2,
                                  secondPoint.x / 2 - firstPoint.x / 2,
                                  secondPoint.y / 2 - firstPoint.y / 2
                              )
                          )
                        : src.roi(
                              new cv.Rect(
                                  secondPoint.x / 2,
                                  firstPoint.y / 2,
                                  firstPoint.x / 2 - secondPoint.x / 2,
                                  secondPoint.y / 2 - firstPoint.y / 2
                              )
                          );

                addCanvas(
                    questionROI,
                    "question" + (marker.id + 1),
                    "Question " + (marker.id + 1)
                );

                questionROI.delete();
            }

            function getMarkerPoint(
                corner: { x: number; y: number }[],
                position:
                    | "bottomRight"
                    | "bottomLeft"
                    | "topRight"
                    | "topLeft"
                    | "middleRight"
                    | "middleLeft"
                    | "middleTop"
                    | "middleBottom"
                    | "middle"
            ) {
                switch (position) {
                    case "bottomLeft":
                        return { ...corner[3] };
                    case "bottomRight":
                        return { ...corner[2] };
                    case "topLeft":
                        return { ...corner[0] };
                    case "topRight":
                        return { ...corner[1] };
                    case "middleLeft":
                        return {
                            x: (corner[0].x + corner[3].x) / 2,
                            y: (corner[0].y + corner[3].y) / 2,
                        };
                    case "middleRight":
                        return {
                            x: (corner[1].x + corner[2].x) / 2,
                            y: (corner[1].y + corner[2].y) / 2,
                        };
                    case "middleTop":
                        return {
                            x: (corner[0].x + corner[1].x) / 2,
                            y: (corner[0].y + corner[1].y) / 2,
                        };
                    case "middleBottom":
                        return {
                            x: (corner[2].x + corner[3].x) / 2,
                            y: (corner[2].y + corner[3].y) / 2,
                        };
                    case "middle":
                        return {
                            x:
                                (corner[1].x +
                                    corner[2].x +
                                    corner[3].x +
                                    corner[0].x) /
                                4,
                            y:
                                (corner[1].y +
                                    corner[2].y +
                                    corner[3].y +
                                    corner[0].y) /
                                4,
                        };
                }
            }
        }
    });
    if (showWork) addCanvas(src, "arucoDetection", "Aruco detection");

    src.delete();
    srcDecode.delete();
}

function addCanvas(data: cv.Mat, id: string, subtitle?: string) {
    const container = document.createElement("div");
    container.id = id + "Container";

    const canvas = document.createElement("canvas");
    canvas.width = data.cols;
    canvas.height = data.rows;
    canvas.id = id + "Img";

    cv.imshow(canvas, data);

    container.appendChild(canvas);

    if (subtitle) {
        const subtitleElement = document.createElement("span");
        subtitleElement.id = id + "Subtitle";
        subtitleElement.textContent = subtitle;

        container.appendChild(subtitleElement);
    }

    document.body.appendChild(container);
}

