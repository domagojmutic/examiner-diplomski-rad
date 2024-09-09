import { type CV } from "@techstark/opencv-js";
import { type QuestionType } from "../models/QuestionModels";

// export default interface questionPlugin {
//     analyzeImage: (
//         cv: CV,
//         buffer: Buffer,
//         width: number,
//         height: number,
//         question: QuestionType,
//         seed: number
//     ) => Promise<{ [key: string]: unknown }>;
// }

export default interface questionPlugin {
    script: string;
}
