import { ContentListSchema, ContentSchema, Response, SavedSchema } from "../../utils/schema";
import { content, contents, contentSave } from "../../utils/content";
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
import { OK } from "../../utils/constant";

const innerAudioContext: WechatMiniprogram.InnerAudioContext = wx.createInnerAudioContext({
    useWebAudioImplement: true
})
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
            type: 0,
            typeStr: ""
        },
        detailPopup: {
            visible: false,
            content: "",
            title: "",
            type: 0
        },
        picker: {
            visible: false,
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
            {
                label: '图片',
                value: 3,
                block: false,
            },
        ]
    },

    innerAudioContext: innerAudioContext,

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
                type: res.data.type,
                typeStr: res.data.type_str
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
        this.setData({ popup: { visible: false, title: "", content: "", type: 0, typeStr: "" } })
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
        const type: number = e.currentTarget.dataset.type
        let items: any[] = [
            {
                label: type === 1 ? '播放' : '查看',
                index: 1,
                id: id
            },
            {
                label: '编辑',
                index: 2,
                id: id
            }
        ]
        
        if (type === 1) {
            items.push({
                label: '暂停',
                index: 3,
                id: id
            })
        }

        ActionSheet.show({
            theme: ActionSheetTheme.List,
            selector: '#t-action-sheet',
            context: this,
            items: items,
        });
    },

    async handleSelected(e: WechatMiniprogram.TouchEvent) {
        const index: number = e.detail.selected.index
        const id: number = e.detail.selected.id

        switch (index) {
            case 1:
                const res: Response<ContentSchema> = await content(id)
                if (res.data.type === 1) {
                    this.innerAudioContext.src = res.data.content
                    this.innerAudioContext.seek(0)
                    this.innerAudioContext.play()
                    break
                }
                this.setData({
                    ["popup.visible"]: false,
                    detailPopup: {
                        visible: true,
                        content: res.data.content,
                        title: res.data.title,
                        type: res.data.type
                    }
                });
                break
            case 2:
                await this.bindEdit(id)
                break
            case 3:
                this.innerAudioContext.stop()
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
                type: 0,
                typeStr: ""
            }
        });
    },

    onTypePickerChicked() {
        this.setData({
            picker: {
                visible: true
            }
        });
    },

    onPickerChange(e) {
        this.setData({
            ["popup.type"]: e.detail.value[0],
            ["popup.typeStr"]: e.detail.label[0],
        })
    },

    onPickerCancel(e) {
        this.setData({
            picker: {
                visible: false
            }
        });
    },
})