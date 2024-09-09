import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import ApiRoutes from "./routes/api";
import DatabaseConnection from "./databases/DatabasePlugin";
import QuestionTypes from "./questionPlugins/QuestionPlugins";
import OpencvPlugin from "./opencv/OpencvPlugin";
import PuppeteerClusterPlugin from "./workers/PuppeteerClusterPlugin";
import {
    ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";
import path from "path";
import { readFileSync } from "fs-extra";
import { contentParser } from "fastify-multer";
import UploadRoutes from "./routes/upload";

export const app = Fastify({
    logger: {
        level: "debug",
        serializers: {
            res(res) {
                return {
                    statusCode: res.statusCode,
                };
            },
            req(req) {
                return {
                    method: req.method,
                    url: req.url,
                    parameters: req.params,
                };
            },
        },
    },
    https: {
        key: readFileSync(path.join(__dirname, "../cert/key.pem")),
        cert: readFileSync(path.join(__dirname, "../cert/cert.pem")),
    },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(PuppeteerClusterPlugin);
// app.register(OpencvPlugin);
app.register(DatabaseConnection);
app.register(QuestionTypes);

app.register(contentParser);
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "ExaminerApi",
            description: "Examiner backend service",
            version: "1.0.0",
        },
        servers: [],
    },
    transform: jsonSchemaTransform,
});

app.register(cors, {});

app.register(fastifySwaggerUI, {
    routePrefix: "/api",
});
app.register(ApiRoutes, { prefix: "/api" });
app.register(UploadRoutes, { prefix: "/upload" });
app.register(fastifyStatic, {
    root: path.join(__dirname, "../pdf-frontend/dist"),
    prefix: "/template/",
    decorateReply: false,
});
app.register(fastifyStatic, {
    root: path.join(__dirname, "../scanner-frontend/dist"),
    prefix: "/scanner/",
    decorateReply: false,
});
app.register(fastifyStatic, {
    root: path.join(__dirname, "../plugins"),
    prefix: "/plugins/",
    decorateReply: false,
});
app.register(fastifyStatic, {
    root: path.join(__dirname, "../uploads"),
    prefix: "/uploads/",
    decorateReply: false,
});
app.register(fastifyStatic, {
    root: path.join(__dirname, "../examSheets"),
    prefix: "/images/",
    decorateReply: false,
});

export let serverAddress = "";

try {
    app.listen({ host: "0.0.0.0", port: 3000 }, function (err, address) {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        serverAddress = address.replace("0.0.0.0", "localhost");
    });
} catch (error) {
    app.log.error(error);
}
