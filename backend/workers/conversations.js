import { Worker, Queue } from "bullmq";
import dotenv from "dotenv";
import Redis from "ioredis";
import { QEUES } from "../utils/constants.js";
import { initDb, readFromSQlite } from "../config/sqlite.js";

// init sqlite db
(async () => {
    try {
        await initDb();
        executeWorkerAction();
        console.log("[QEUE-SQLITE] DB INITIALIZED");
    } catch (err) {
        console.log("[QEUE-SQLITE] ERROR", err);
    }
})();

dotenv.config({ path: ".env" });

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const conversationTaggingQueue = new Queue(QEUES.conversationTagging, {
    connection,
});

const worker = new Worker(
    QEUES.conversationTagging,
    async (job) => {
        console.log(job.data);
    },
    { connection },
);

worker.on("ready", () => {
    console.log(`[QEUE-WORKER] ready`);
});

worker.on("active", () => {
    console.log(`[QEUE-WORKER] active`);
});

worker.on("completed", (job) => {
    console.log(`[QEUE-WORKER] completed`, job.id);
});

worker.on("failed", (job, err) => {
    console.log(`[QEUE-WORKER] failed`, job, err);
});

async function executeWorkerAction() {
    const conversationHistory = await readFromSQlite(`SELECT * FROM messages`);
    console.log("conversationHistory", conversationHistory);
}

// start worker
setInterval(async () => {
    console.log("[QEUE-WORKER] initiated");
    // await executeWorkerAction();
    await conversationTaggingQueue.add(QEUES.conversationTagging, {
        conversation_id: Date.now(),
    });
}, 1800000); // 30 minutes = 1800000
