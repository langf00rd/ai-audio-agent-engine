import jwt from "jsonwebtoken";
/**
 * verifies and returns the decoded jwt
 * @returns {{userId:number,iat:number,exp:number}}
 */
export function decodeJWT(token) {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    return result;
}
