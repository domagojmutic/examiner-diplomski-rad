/*! jscanify v1.2.0 | (c) ColonelParrot and other contributors | MIT License */
import cv from "@techstark/opencv-js";

interface Point {
    x: number;
    y: number;
}

/**
 * Calculates distance between two points. Each point must have `x` and `y` property
 * @param {*} p1 point 1
 * @param {*} p2 point 2
 * @returns distance between two points
 */
function distance(p1: Point, p2: Point) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Finds the contour of the paper within the image
 * @param {*} img image to process (cv.Mat)
 * @returns the biggest contour inside the image
 */
function findPaperContour(img: cv.Mat) {
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    // const imgMorph = new cv.Mat();
    // cv.morphologyEx(
    //     img,
    //     imgMorph,
    //     cv.MORPH_CLOSE,
    //     cv.getStructuringElement(1, new cv.Size(5, 5)),
    //     new cv.Point(-1,-1),
    //     3
    // );

    const imgBlur = new cv.Mat();
    cv.GaussianBlur(
        imgGray,
        imgBlur,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT
    );

    const imgThresh = new cv.Mat();
    cv.adaptiveThreshold(
        imgBlur,
        imgThresh,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        21,
        2
      );

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
        imgThresh,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE
    );
    let maxArea = 0;
    let maxContourIndex = -1;
    for (let i = 0; i < contours.size(); ++i) {
        let contourArea = cv.contourArea(contours.get(i));
        if (contourArea > maxArea) {
            maxArea = contourArea;
            maxContourIndex = i;
        }
    }

    const maxContour =
        maxContourIndex > -1 ? contours.get(maxContourIndex) : null;

    imgGray.delete();
    imgBlur.delete();
    imgThresh.delete();
    contours.delete();
    hierarchy.delete();
    return maxContour;
}

/**
 * Highlights the paper detected inside the image.
 * @param {*} image image to process
 * @param {*} options options for highlighting. Accepts `color` and `thickness` parameter
 * @returns `HTMLCanvasElement` with original image and paper highlighted
 */
export function highlightPaper(
    image: HTMLCanvasElement | HTMLImageElement,
    options: { color: string; thickness: number } = {
        color: "orange",
        thickness: 10,
    }
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = cv.imread(image);

    const maxContour = findPaperContour(img);
    cv.imshow(canvas, img);
    if (maxContour) {
        const {
            topLeftCorner,
            topRightCorner,
            bottomLeftCorner,
            bottomRightCorner,
        } = getCornerPoints(maxContour);

        if (
            topLeftCorner &&
            topRightCorner &&
            bottomLeftCorner &&
            bottomRightCorner
        ) {
            ctx!.strokeStyle = options.color;
            ctx!.lineWidth = options.thickness;
            ctx!.beginPath();
            ctx!.moveTo(topLeftCorner.x, topLeftCorner.y);
            ctx!.lineTo(topRightCorner.x, topRightCorner.y);
            ctx!.lineTo(bottomRightCorner.x, bottomRightCorner.y);
            ctx!.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
            ctx!.lineTo(topLeftCorner.x, topLeftCorner.y);
            ctx!.stroke();
        }
    }

    img.delete();
    return canvas;
}

/**
 * Extracts and undistorts the image detected within the frame.
 * @param {*} image image to process
 * @param {*} resultWidth desired result paper width
 * @param {*} resultHeight desired result paper height
 * @param {*} cornerPoints optional custom corner points, in case automatic corner points are incorrect
 * @returns `HTMLCanvasElement` containing undistorted image
 */
export function extractPaper(
    image: HTMLCanvasElement | HTMLImageElement,
    resultWidth: number,
    resultHeight: number,
    cornerPoints?: {
        topLeftCorner:
            | {
                  x: any;
                  y: any;
              }
            | undefined;
        topRightCorner:
            | {
                  x: any;
                  y: any;
              }
            | undefined;
        bottomLeftCorner:
            | {
                  x: any;
                  y: any;
              }
            | undefined;
        bottomRightCorner:
            | {
                  x: any;
                  y: any;
              }
            | undefined;
    }
) {
    const canvas = document.createElement("canvas");

    const img = cv.imread(image);

    const maxContour = findPaperContour(img);

    const {
        topLeftCorner,
        topRightCorner,
        bottomLeftCorner,
        bottomRightCorner,
    } = cornerPoints || getCornerPoints(maxContour);
    let warpedDst = new cv.Mat();

    let dsize = new cv.Size(resultWidth, resultHeight);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        topLeftCorner?.x,
        topLeftCorner?.y,
        topRightCorner?.x,
        topRightCorner?.y,
        bottomLeftCorner?.x,
        bottomLeftCorner?.y,
        bottomRightCorner?.x,
        bottomRightCorner?.y,
    ]);

    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0,
        0,
        resultWidth,
        0,
        0,
        resultHeight,
        resultWidth,
        resultHeight,
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(
        img,
        warpedDst,
        M,
        dsize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar()
    );

    cv.imshow(canvas, warpedDst);

    img.delete();
    warpedDst.delete();
    return canvas;
}

/**
 * Calculates the corner points of a contour.
 * @param {*} contour contour from {@link findPaperContour}
 * @returns object with properties `topLeftCorner`, `topRightCorner`, `bottomLeftCorner`, `bottomRightCorner`, each with `x` and `y` property
 */
function getCornerPoints(contour: cv.Mat | null) {
    if (!contour) throw Error("Expected contour");
    let rect = cv.minAreaRect(contour);
    const center = rect.center;

    let topLeftCorner;
    let topLeftCornerDist = 0;

    let topRightCorner;
    let topRightCornerDist = 0;

    let bottomLeftCorner;
    let bottomLeftCornerDist = 0;

    let bottomRightCorner;
    let bottomRightCornerDist = 0;

    for (let i = 0; i < contour.data32S.length; i += 2) {
        const point = {
            x: contour.data32S[i],
            y: contour.data32S[i + 1],
        };
        const dist = distance(point, center);
        if (point.x < center.x && point.y < center.y) {
            // top left
            if (dist > topLeftCornerDist) {
                topLeftCorner = point;
                topLeftCornerDist = dist;
            }
        } else if (point.x > center.x && point.y < center.y) {
            // top right
            if (dist > topRightCornerDist) {
                topRightCorner = point;
                topRightCornerDist = dist;
            }
        } else if (point.x < center.x && point.y > center.y) {
            // bottom left
            if (dist > bottomLeftCornerDist) {
                bottomLeftCorner = point;
                bottomLeftCornerDist = dist;
            }
        } else if (point.x > center.x && point.y > center.y) {
            // bottom right
            if (dist > bottomRightCornerDist) {
                bottomRightCorner = point;
                bottomRightCornerDist = dist;
            }
        }
    }

    return {
        topLeftCorner,
        topRightCorner,
        bottomLeftCorner,
        bottomRightCorner,
    };
}
