import { Response, ContentListSchema, ContentSchema, SavedSchema, ContentTypeSchema, GachaLogSchma } from "./schema";
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

export function typeList(): Promise<Response<ContentTypeSchema[]>> {
    return get("/content/type-list")
}

export function gacha(id: number): Promise<Response<GachaLogSchma[]>> {
    return get("/content/gacha", {
        id,
        gacha_type: 301
    })
}