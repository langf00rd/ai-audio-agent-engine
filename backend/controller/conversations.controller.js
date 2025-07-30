import {
  getTaggedConversationService,
  taggingService,
} from "../services/ai.service.js";
import {
  analyzeConversationsService,
  createConversationService,
  getAnalyzedConversationsService,
  getConversationsService,
} from "../services/conversation.service.js";
import { groupConversationsBySession } from "../utils/index.js";

export async function createConversationController(req, res) {
  const { data, error, status } = await createConversationService(req.body);
  res.status(status).send({ data, error });
}

export async function getConversationsController(req, res) {
  const { data, error, status } = await getConversationsService(req.query);
  res.status(status).send({ data, error });
}

export async function analyzeConversationsController(req, res) {
  const { data, error, status } = await analyzeConversationsService(
    req.params.sessionId,
  );
  res.status(status).send({ data, error });
}

export async function getAnalyzedConversationsController(req, res) {
  const { data, error, status } = await getAnalyzedConversationsService({
    session_id: req.params.sessionId,
  });
  res.status(status).send({ data, error });
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
