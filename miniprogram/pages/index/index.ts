import { userInfo } from "../../utils/user";
import { secretCheck } from "../../utils/secret";
import { Response, SecretSchema } from "../../utils/schema";
import { OK } from "../../utils/constant";

Page({
    data: {
        secret: ""
    },

    async onLoad() {
        await userInfo()
    },

    async bindSecretCheck() {
        const res: Response<SecretSchema> = await secretCheck(this.data.secret)
        if (res.code !== OK) {
            wx.showModal({
                title: res.message
            })
        }
    },

    async onSecretChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            secret: e.detail.value
        });
    }
})