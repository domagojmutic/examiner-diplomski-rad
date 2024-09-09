import { type Mat, type CV } from "../opencv_types";

declare global {
    const cv: CV;
    function analyzeImage(
        image: string,
        question: Question,
        seed: number
    ): Promise<{
        answers: string[];
        correctAnswers: string[];
        numberOfCorrect: number;
        numberOfIncorrect: number;
    }>;
}

interface Question {
    id: string;
    type: string;
    tags: string[];
    text: string;
    questionObject: {
        randomOrder: boolean;
        options: {
            text: string;
            required: boolean;
            correctAnswer: boolean;
        }[];
        showOptions: number;
    };
    answerObject: {};
}

window.analyzeImage = async function analyzeImage(
    image: string,
    question: Question,
    seed: number
) {
    const seededQuestion = getSeededQuestion(question, seed);
    const answers = await extractAnswers(image);

    const result: {
        answers: string[];
        correctAnswers: string[];
        numberOfCorrect: number;
        numberOfIncorrect: number;
    } = {
        answers: [],
        correctAnswers: seededQuestion.questionObject.options
            .filter((opt) => opt.correctAnswer)
            .map((opt) => opt.text),
        numberOfCorrect: 0,
        numberOfIncorrect: 0,
    };

    answers.forEach((answerIndex) => {
        result.answers.push(
            seededQuestion.questionObject.options[answerIndex].text
        );
        if (
            seededQuestion.questionObject.options[answerIndex].correctAnswer ===
            true
        )
            result.numberOfCorrect++;
        else if (
            seededQuestion.questionObject.options[answerIndex].correctAnswer ===
            false
        )
            result.numberOfIncorrect++;
    });

    return result;
};

async function extractAnswers(image: string) {
    const markedAnswers: number[] = [];

    const img = document.createElement("img");
    img.src = image;

    await new Promise((resolve) => {
        document.body.appendChild(img);
        img.onload = () => {
            resolve(true);
        };
    });

    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    if (!context) throw Error("Expected context");

    context.drawImage(img, 0, 0);
    const imgData = context.getImageData(0, 0, img.width, img.height);

    const src = cv.matFromImageData(imgData);

    addCanvas(src, "src", "src"); // DEBUG code

    const enhancedSrc = new cv.Mat();

    // Grayscale
    cv.cvtColor(src, enhancedSrc, cv.COLOR_BGR2GRAY);

    addCanvas(enhancedSrc, "gray", "gray"); // DEBUG code

    // Threshold
    cv.threshold(
        enhancedSrc,
        enhancedSrc,
        0,
        255,
        cv.THRESH_BINARY_INV | cv.THRESH_OTSU
    );

    addCanvas(enhancedSrc, "threshold", "threshold"); // DEBUG code

    const questionContourList = [];
    const questionContours = new cv.MatVector();
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
            questionContourList.push(contour);
        }
    }

    questionContourList
        .sort((a, b) => {
            return cv.boundingRect(a).x - cv.boundingRect(b).x;
        })
        .forEach((contour) => questionContours.push_back(contour));

    for (let i = 0; i < questionContours.size(); i++) {
        const mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
        cv.drawContours(mask, questionContours, i, new cv.Scalar(255), -1);

        const max = cv.countNonZero(mask);

        cv.bitwise_and(enhancedSrc, enhancedSrc, mask, mask);
        const n = cv.countNonZero(mask);

        if (n / max > 0.5) markedAnswers.push(i);
    }

    return markedAnswers;
}

function getSeededQuestion(question: Question, seed: number) {
    const seededQuestion = structuredClone(question);
    if (
        seededQuestion.questionObject.options.length <=
        seededQuestion.questionObject.showOptions
    )
        return seededQuestion;

    const optionsList: {
        text: string;
        required: boolean;
        correctAnswer: boolean;
    }[] = [];
    const helperList: {
        text: string;
        required: boolean;
        correctAnswer: boolean;
    }[] = [];

    seededQuestion.questionObject.options.forEach((option) => {
        if (option.required) optionsList.push(option);
        else helperList.push(option);
    });

    if (optionsList.length >= seededQuestion.questionObject.showOptions) {
        seededQuestion.questionObject.options = optionsList;
        return question;
    }

    for (
        let i = 0;
        i <
        Math.min(
            seededQuestion.questionObject.showOptions - optionsList.length,
            helperList.length
        );
        i++
    ) {
        const index = seed % helperList.length;
        optionsList.push(helperList[index]);
        helperList.splice(index, 1);
    }

    if (!seededQuestion.questionObject.randomOrder) {
        seededQuestion.questionObject.options =
            seededQuestion.questionObject.options.filter((option) =>
                optionsList.includes(option)
            );
        return seededQuestion;
    }

    seededQuestion.questionObject.options = optionsList;

    return seededQuestion;
}

function addCanvas(data: Mat, id: string, subtitle?: string) {
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
