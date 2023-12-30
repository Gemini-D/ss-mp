import { Response, SecretSchema } from "./schema";
import { post } from "./api";

export function secretCheck(secret: string): Promise<Response<SecretSchema>> {
    return post("/secret/check", {
        secret
    })
}