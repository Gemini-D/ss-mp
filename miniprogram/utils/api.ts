import { BASE_URI } from './env';
import { OK, TOKEN_INVALID, X_TOKEN } from "./constant";
import { LoginSchema, Response } from "./schema";

export function post(path: string, body: any): Promise<Response<any>> {
    return new Promise((resolve) => {
        wx.request({
            url: BASE_URI + path,
            method: 'POST',
            data: body,
            header: {
                'content-type': 'application/json',
                'x-token': wx.getStorageSync(X_TOKEN)
            },
            success: async (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
                console.log(res.data)
                // @ts-ignore
                const data: Response<any> = res.data;
                if (data.code === TOKEN_INVALID) {
                    await login()
                    resolve(await get(path, body))
                    return
                }
                resolve(data)
            }
        })
    })
}

export function del(path: string, body: any = null): Promise<Response<any>> {
    return new Promise((resolve) => {
        wx.request({
            url: BASE_URI + path,
            method: 'DELETE',
            data: body,
            header: {
                'content-type': 'application/json',
                'x-token': wx.getStorageSync(X_TOKEN)
            },
            success: async (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
                console.log(res.data)
                // @ts-ignore
                const data: Response<any> = res.data;
                if (data.code === TOKEN_INVALID) {
                    await login()
                    resolve(await get(path, body))
                    return
                }
                resolve(data)
            }
        })
    })
}

export function get(path: string, body: any = null): Promise<Response<any>> {
    return new Promise((resolve) => {
        wx.request({
            url: BASE_URI + path,
            method: 'GET',
            data: body,
            header: {
                'x-token': wx.getStorageSync(X_TOKEN)
            },
            success: async (res: WechatMiniprogram.RequestSuccessCallbackResult) => {
                console.log(res.data)
                // @ts-ignore
                const data: Response<any> = res.data;
                if (data.code === TOKEN_INVALID) {
                    await login()
                    resolve(await get(path, body))
                    return
                }

                resolve(data)
            }
        })
    })
}

export function login(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        wx.login({
            success: async res => {
                const response: Response<LoginSchema> = await post("/login", { code: res.code })
                if (response.code === OK) {
                    wx.setStorageSync(X_TOKEN, response.data.token)
                    resolve(true)
                } else {
                    wx.showModal({ title: response.message })
                    reject(response)
                }
            },
        })
    })
}