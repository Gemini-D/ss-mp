import { userInfo } from "../../utils/user";
import { secretCheck, secretCreate } from "../../utils/secret";
import { Response, SavedSchema, SecretSchema } from "../../utils/schema";
import { OK } from "../../utils/constant";

Page({
    data: {
        secret: "",
        popup: {
            visible: false,
        },
        form: {
            value: ""
        }
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
            return
        }

        await wx.navigateTo({
            url: `/pages/content/content?id=${res.data.id}`
        })
    },

    async onSecretChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            secret: e.detail.value
        });
    },

    async bindSecretCreate() {
        const res: Response<SavedSchema> = await secretCreate(this.data.form.value)
        if (res.code !== OK) {
            wx.showModal({
                title: res.message
            })
            return
        }

        this.setData({
            ["popup.visible"]: false,
        });
    },

    async onValueChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["form.value"]: e.detail.value
        });
    },

    onVisibleChange(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["popup.visible"]: e.detail.visible,
        });
    },

    showPopup() {
        this.setData({
            ["popup.visible"]: true,
            ["form.value"]: ""
        });
    },
})