import jwt, { JwtPayload } from "jsonwebtoken"
import { idText } from "typescript";

export class UserGuard {
    authentication(token: string) {
        try {
            return jwt.verify(token, String(process.env["JWT_KEY"])) as JwtPayload;
        } catch (err) {
            return false;
        }
    }

    authorization(id: number, token: string) {
        try {
            const decodedToken = this.authentication(token);
            if (typeof decodedToken === "boolean") {
                return false;
            }
            if (decodedToken.id !== id) {
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    }
}