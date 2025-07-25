import {
    getTaggedConversationService,
    taggingService,
} from "../services/ai.service.js";
import { getConversationsService } from "../services/conversations.service.js";
import { groupConversationsBySession } from "../utils/index.js";

export async function getConversationsController(req, res) {
    let response;
    const { agent_id, order_by } = req.query;
    if (agent_id) response = await getConversationsService({ agent_id });
    if (order_by === "session") {
        response.data = groupConversationsBySession(response.data || []);
    }
    res.status(response.status).send({
        data: response.data,
        error: response.error,
    });
}

export async function createConvoTaggingController(req, res) {
    const { data, error, status } = await taggingService(req.params.sessionId);
    res.status(status).send({ data, error });
}

export async function getConvoTaggingController(req, res) {
    const { data, error, status } = await getTaggedConversationService(
        req.params.sessionId,
    );
    res.status(status).send({ data, error });
}
