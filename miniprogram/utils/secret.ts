import { MessageSchema, Response, SavedSchema, SecretSchema } from "./schema";
import { get, post } from "./api";

export function secretCheck(secret: string): Promise<Response<SecretSchema>> {
    return post("/secret/check", {
        secret
    })
}

export function secretCreate(secret: string): Promise<Response<SavedSchema>> {
    return post("/secret/create", {
        secret
    })
}

export function secretMessage(): Promise<Response<MessageSchema>> {
    return get("/secret/message")
}