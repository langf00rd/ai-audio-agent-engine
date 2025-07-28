import { getUserService } from "../services/users.service.js";
import { decodeJWT } from "../utils/auth.js";

export async function authMiddleware(req, res) {
    const { error: userError } = await getUserService({
        id: decodeJWT(req.headers.authorization).userId,
    });
    if (!userError) return res.status(401).send({ error: userError });
}
