import { Response, UserSchema } from "./schema";
import { get } from "./api";

export function userInfo(): Promise<Response<UserSchema>> {
    return get("/user/info")
}