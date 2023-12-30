import { Response, ContentListSchema, ContentSchema, SavedSchema } from "./schema";
import { get, post } from "./api";

export function contents(secretId: number): Promise<Response<ContentListSchema>> {
    return get("/content/list", {
        secret_id: secretId
    })
}

export function content(id: number): Promise<Response<ContentSchema>> {
    return get("/content/info", {
        id
    })
}

export function contentSave(content: ContentSchema): Promise<Response<SavedSchema>> {
    return post("/content/save", content)
}