import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import IQuestionPlugin from "./IQuestionPlugin";
import { readdirSync } from "fs-extra";

declare module "fastify" {
    interface FastifyInstance {
        questionTypes: { [key: string]: IQuestionPlugin };
    }
}

const QuestionTypes: FastifyPluginAsync = async function dbConnector(
    app: FastifyInstance,
    options: FastifyPluginOptions
) {
    console.log("question plugin - start");

    const plugins = readdirSync("./plugins/questions/");

    const questionTypes: { [kex: string]: IQuestionPlugin } = {};

    plugins.forEach(async (plugin) => {
        questionTypes[plugin.toLocaleLowerCase()] = {
            script: "./plugins/questions/" + plugin + "/imageAnalyser.js",
        };
    });

    if (app.questionTypes !== undefined) {
        return;
    }

    app.decorate("questionTypes", questionTypes);
};

export default fastifyPlugin(QuestionTypes);
