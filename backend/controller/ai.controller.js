import { aiChatService, taggingService } from "../services/ai.service.js";

export async function aiChatController(req, res) {
    const { data, error, status } = await aiChatService(req.body);
    res.status(status).send({ data, error });
}

export async function taggingController(req, res) {
    const { data, error, status } = await taggingService(req.body);
    res.status(status).send({ data, error });
}
