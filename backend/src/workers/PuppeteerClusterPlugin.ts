import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Cluster } from "puppeteer-cluster";
import { scanQuestion, scanSheet } from "./sheetAnalyser";

declare module "fastify" {
    interface FastifyInstance {
        analyzeSheets: Cluster<any, any>;
        analyzeQuestion: Cluster<any, any>;
    }
}

const WorkersInitialization: FastifyPluginAsync = async function initWorkers(
    app: FastifyInstance,
    options: FastifyPluginOptions
) {
    console.log("workers plugin - start");

    const cluster1 = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
            acceptInsecureCerts: true,
            headless: true
        },
    });
    const cluster2 = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
            acceptInsecureCerts: true,
            headless: true
        },
    });

    cluster1.task(scanSheet);
    cluster2.task(scanQuestion);

    if (app.analyzeSheets !== undefined && app.analyzeQuestion !== undefined) {
        return;
    }

    app.decorate("analyzeSheets", cluster1);
    app.decorate("analyzeQuestion", cluster2);

    app.addHook("onClose", async (instance) => {
        await cluster1.idle();
        await cluster1.close();
        await cluster2.idle();
        await cluster2.close();
    });
};

export default fastifyPlugin(WorkersInitialization);
