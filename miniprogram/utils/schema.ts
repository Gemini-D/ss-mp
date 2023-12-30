export interface Response<T> {
    code: number
    data: T,
    message: string | undefined
}

export interface LoginSchema {
    token: string
}

export interface UserSchema {
    id: number
    created_at: string
    updated_at: string
}

export interface SavedSchema {
    saved: boolean,
    value: string,
    number: number
}

export interface SecretSchema {
    id: number
    user_id: number
}

export interface ContentListSchema {
    count: number,
    list: ContentSchema[]
}

export interface ContentSchema {
    id: number
    secret_id: number
    title: string
    content: string
}