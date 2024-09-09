import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import IDatabase from "./IDatabase";

declare module "fastify" {
    interface FastifyInstance {
        db: IDatabase;
    }
}

const DatabaseConnection: FastifyPluginAsync = async function dbConnector(
    app: FastifyInstance,
    options: FastifyPluginOptions
) {
    console.log("plugin - start");

    const { default: Database } = await import(
        //@ts-ignore
        "../../../database-sqlite/dist/index.js"
    );
    
        // "../../plugins/database/sqlite/build/index.js"
    const db = new Database.default();

    if (app.db !== undefined) {
        return;
    }

    app.decorate("db", db);
    //fastify.addHook("onClose", (fastify) => db.close());
};

export default fastifyPlugin(DatabaseConnection);
