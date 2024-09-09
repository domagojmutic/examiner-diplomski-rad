import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import cv from '@techstark/opencv-js'

declare module "fastify" {
    interface FastifyInstance {
        cv: typeof cv;
    }
}

const OpenCVRegistration: FastifyPluginAsync = async function initOpenCV(
    app: FastifyInstance,
    options: FastifyPluginOptions
) {
    console.log("opencv plugin - start");

    cv.onRuntimeInitialized = () => {
        app.log.info("OpenCV.js initialized")
    }
    
    if (app.cv !== undefined) {
        return;
    }
    app.decorate("cv", cv);
};

export default fastifyPlugin(OpenCVRegistration);
