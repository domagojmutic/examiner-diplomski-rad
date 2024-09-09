import { type CV } from "../opencv_types";

declare global {
    const cv: CV;
    function analyzeImage(
        image: string,
        question: Question,
        seed: number
    ): Promise<{}>;
}

interface Question {
    id: string;
    type: string;
    tags: string[];
    text: string;
    questionObject: {};
    answerObject: {};
}

window.analyzeImage = async function analyzeImage(
    image: string,
    question: Question,
    seed: number
) {
    return {};
};
