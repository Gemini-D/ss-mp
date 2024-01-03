import { ContentListSchema, ContentSchema, Response, SavedSchema } from "../../utils/schema";
import { content, contents, contentSave } from "../../utils/content";
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
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
            content: "",
            type: 0
        },
        detailPopup: {
            visible: false,
            content: ""
        },
        typeSelector: [
            {
                label: '文本',
                value: 0,
                block: false,
            },
            {
                label: '音频',
                value: 1,
                block: false,
            },
            {
                label: '视频',
                value: 2,
                block: false,
            },
        ]
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

    async bindEdit(id: number) {
        const res: Response<ContentSchema> = await content(id)

        this.setData({
            popup: {
                visible: true,
                id: res.data.id,
                title: res.data.title,
                content: res.data.content,
                type: res.data.type
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

    onDetailVisibleChange(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["detailPopup.visible"]: e.detail.visible,
        });
    },

    async cancelPopup() {
        this.setData({ popup: { visible: false, title: "", content: "", type: 0 } })
    },

    async onTypeChanged(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            ["popup.type"]: e.detail.value
        });
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

    bindTapItem(e: WechatMiniprogram.TouchEvent) {
        const id: number = e.currentTarget.dataset.id
        ActionSheet.show({
            theme: ActionSheetTheme.List,
            selector: '#t-action-sheet',
            context: this,
            items: [
                {
                    label: '查看',
                    index: 1,
                    id: id
                },
                {
                    label: '编辑',
                    index: 2,
                    id: id
                },
            ],
        });
    },

    async handleSelected(e: WechatMiniprogram.TouchEvent) {
        const index: number = e.detail.selected.index
        const id: number = e.detail.selected.id

        switch (index) {
            case 1:
                const res: Response<ContentSchema> = await content(id)
                this.setData({
                    ["popup.visible"]: false,
                    detailPopup: {
                        visible: true,
                        content: res.data.content
                    }
                });
                break
            case 2:
                await this.bindEdit(id)
                break
        }
    },

    showPopup() {
        this.setData({
            popup: {
                visible: true,
                id: 0,
                title: "",
                content: "",
                type: 0
            }
        });
    },
})