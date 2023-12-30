export interface Response<T> {
    code: number
    data: T,
    message: string | undefined
}

export interface LoginSchema {
    token: string
}

export interface SavedSchema {
    saved: boolean,
    value: string,
    number: number
}