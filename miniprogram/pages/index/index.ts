import { userInfo } from "../../utils/user";
import { secretCheck, secretCreate, secretMessage } from "../../utils/secret";
import { MessageSchema, Response, SavedSchema, SecretSchema, UserSchema } from "../../utils/schema";
import { OK } from "../../utils/constant";

Page({
    data: {
        secret: "",
        user: {
            id: 0
        },
        popup: {
            visible: false,
        },
        form: {
            value: ""
        }
    },

    async onLoad() {
        const info: Response<UserSchema> = await userInfo()
        this.setData({
            user: info.data
        })
        if (!info.data.has_secret) {
            wx.showModal({
                title: "提示",
                content: "您还没有创建过密钥，请点击右下角的按钮添加密钥"
            })
        }
        wx.showShareMenu({
            withShareTicket: true,
            menus: [ 'shareAppMessage', 'shareTimeline' ]
        })
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

    async showNotice() {
        const res: Response<MessageSchema> = await secretMessage()

        wx.showModal({
            title: "提示",
            content: res.data.message
        })
    }
})