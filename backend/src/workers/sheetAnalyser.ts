import { Page } from "puppeteer";
import { getExam } from "../services/ExamServices";
import { app, serverAddress } from "../app";
import {
    createExamInstanceStudentAnswer,
    getExamInstance,
} from "../services/ExamInstanceServices";
import { getStudent } from "../services/StudentServices";
import { getQuestionsForExam } from "../services/QuestionServices";
import { QuestionType } from "../models/QuestionModels";
import { ensureDirSync, moveSync, pathExistsSync } from "fs-extra";
import { stringToNumber } from "../util/string";

export async function scanQuestion({
    page,
    data,
}: {
    page: Page;
    data: {
        question: QuestionType;
        questionImgDataURL: string;
        seed: number;
    };
}) {
    await page.goto(serverAddress + "/scanner/empty.html");
    await page.waitForSelector("#done");

    try {
        await page.addScriptTag({
            path: app.questionTypes[data.question.type.toLocaleLowerCase()]
                .script,
            type: "module",
        });
        const answer = await page.evaluate(
            async({ questionImgDataURL, question, seed }) => {
                //@ts-ignore
                return await analyzeImage(questionImgDataURL, question, seed);
            },
            {
                questionImgDataURL: data.questionImgDataURL,
                question: data.question,
                seed: data.seed,
            }
        );
        return answer;
    } catch (err) {
        app.log.error(
            err,
            "Error with question plugin " +
                data.question.type.toLocaleLowerCase()
        );
    }
}

export async function scanSheet({
    page,
    data: imgId,
}: {
    page: Page;
    data: string;
}) {
    await page.goto(serverAddress + "/scanner/analyser.html#" + imgId);

    await page.waitForSelector("#done");
    const barcodeDataElement = await page.$("#barcodeData");
    const barcodeDataValue = await page.evaluate(
        (el) => el?.textContent,
        barcodeDataElement
    );
    const groupDataElement = await page.$("#groupSubtitle");
    const groupDataValue = await page.evaluate(
        (el) => el?.textContent,
        groupDataElement
    );

    if (!barcodeDataValue || barcodeDataValue.length <= 2)
        throw Error("Unable to find barcode!");
    if (
        !groupDataValue ||
        groupDataValue.length <= 0 ||
        groupDataValue === "undefined"
    )
        throw Error("Unable to determine group!");

    const sheetInfo: {
        examId: string;
        examInstanceId: string;
        studentId: string;
    } = JSON.parse(JSON.parse(barcodeDataValue)[0]);

    const exam = await getExam(sheetInfo.examId);
    const questions = await getQuestionsForExam(sheetInfo.examId);
    const examInstance = await getExamInstance(sheetInfo.examInstanceId);
    const student = await getStudent(sheetInfo.studentId);

    if (!exam) throw Error("Unknown exam. Exam might have been deleted.");
    if (!examInstance)
        throw Error(
            "Unknown exam instance. Exam instance might have been deleted."
        );
    if (!student)
        throw Error("Unknown student. Student might have been deleted.");
    if (!questions) throw Error("Unable to load questions for exam.");

    const answers: { [key: string]: unknown } = {};

    const group = examInstance.groups[parseInt(groupDataValue)];
    const seed = examInstance.seed + stringToNumber(group);

    answers.group = group;
    answers.seed = seed;

    const numberOfQuestions = exam.questionIds.length;

    for (let i = 0; i < numberOfQuestions; i++) {
        // const questionImgElement = await page.$();
        const questionImgDataURL = await page.evaluate((i) => {
            const canvas = document.querySelector(
                "#question" + (i + 1) + "Img"
            ) as HTMLCanvasElement;
            return canvas?.toDataURL();
        }, i);

        if (!questionImgDataURL || questionImgDataURL.length <= 0) continue;

        const question: QuestionType | undefined = questions?.find(
            (question) => {
                // if (exam.configs.questionOrder)
                //     return question.id === exam.configs.questionOrder[i];
                return question.id === exam.questionIds[i];
            }
        );
        if (!question) throw Error("Unable to find question definition");

        const answer = await app.analyzeQuestion.execute({
            question,
            questionImgDataURL,
            seed,
        });
        answers[question.id] = answer;
    }

    ensureDirSync("./examSheets/" + exam.id + "/" + examInstance.id);

    let i = 0;
    while (
        pathExistsSync(
            "./examSheets/" +
                exam.id +
                "/" +
                examInstance.id +
                "/" +
                student.id +
                "-" +
                i
        )
    ) {
        i++;
    }

    moveSync(
        "./uploads/" + imgId,
        "./examSheets/" +
            exam.id +
            "/" +
            examInstance.id +
            "/" +
            student.id +
            "-" +
            i
    );

    createExamInstanceStudentAnswer(examInstance.id, student.id, {
        answerObject: answers,
        examInstanceId: examInstance.id,
        studentId: student.id,
        scanNumber: i,
    });

    return { barcodeDataValue, answers };
}
