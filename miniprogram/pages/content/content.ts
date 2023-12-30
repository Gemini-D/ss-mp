// pages/content/content.ts
import { ContentListSchema, ContentSchema, Response, SavedSchema } from "../../utils/schema";
import { content, contents, contentSave } from "../../utils/content";
import { OK } from "../../utils/constant";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        contents: [],
        popup: {
            visible: false,
            id: 0,
            title: "",
            content: ""
        },
    },

    onLoad(option) {
        this.setData({
            id: parseInt(option.id)
        })
    },

    async onShow() {
        await this.fetchContents()
    },

    async fetchContents() {
        const res: Response<ContentListSchema> = await contents(this.data.id)

        this.setData({
            contents: res.data.list
        })
    },

    async bindTapItem(option: any) {
        const id: number = option.currentTarget.dataset.id

        const res: Response<ContentSchema> = await content(id)

        this.setData({
            popup: {
                visible: true,
                id: res.data.id,
                title: res.data.title,
                content: res.data.content
            }
        });
    },

    async bindContentSave() {
        const res: Response<SavedSchema> = await contentSave({
            secret_id: this.data.id,
            ...this.data.popup
        })

        if (res.code !== OK) {
            await wx.showModal({
                title: res.message
            })
        }

        await this.cancelPopup()
        await this.fetchContents()
    },

    onVisibleChange(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["popup.visible"]: e.detail.visible,
        });
    },

    async cancelPopup() {
        this.setData({ popup: { visible: false, title: "", content: "" } })
    },

    async onContentChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["popup.content"]: e.detail.value
        });
    },

    async onTitleChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["popup.title"]: e.detail.value
        });
    },

    showPopup() {
        this.setData({
            popup:{
                visible: true,
                id: 0,
                title: "",
                content: ""
            }
        });
    },
})