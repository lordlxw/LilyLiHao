<template>
    <div class="chat_box" @click="() => { msgShow = false }" :class="msgShow ? 'message show' : ''">
        <el-container>
            <el-aside width="210px" v-if="asideShow">
                <div class="aside_top">

                </div>
                <div v-infinite-scroll="load">
                    <div v-for="(item) in asideItems" class="chat_item" :key="item.brokerid"
                        @click="changAsideItem(item)">
                        <el-row>
                            <el-col :span="8">
                                <div class="demo-basic--circle">
                                    <div class="block"><el-avatar :size="50">{{ item.company.substr(0, 1)
                                            }}</el-avatar>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="item_name">{{ item.company }}</div>
                                <div class="item_name item_content">{{ item.describe || '没有新消息...' }}</div>
                            </el-col>
                        </el-row>

                    </div>
                </div>
            </el-aside>
            <el-container>
                <el-header style="-webkit-app-region: drag;">
                    <el-row>
                        <el-col :span="8" class="chat_header_left">
                            <el-row>
                                <el-col :span="8">
                                    <div class="demo-basic--circle">
                                        <div class="block"><el-avatar :size="50">{{ mine.company.substr(0, 1)
                                                }}</el-avatar>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="16">
                                    <div class="item_name">{{ mine.company }}</div>
                                    <el-tooltip class="item" effect="dark" :content="describe || '没有新消息...'"
                                        placement="top-start">
                                        <div class="item_name item_content">{{ describe || '没有新消息...' }}</div>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="16">
                        </el-col>
                    </el-row>
                    <div class="header-right">
                        <i @click="minimize" class="el-icon-minus"></i>
                        <i @click="handleClose" class="el-icon-close"></i>
                    </div>
                    <el-divider></el-divider>
                </el-header>
                <div class="el-main" ref="scrollContainer">
                    <div v-for="(item, i) in messages" class="main_item"
                        :class="item.tradeId == highlight ? 'main_item_highlight' : ''" :key="i"
                        v-if="item.brokerId == mine.brokerid && item.channelId == mine.channelId">
                        <el-row>
                            <el-col :span="asideShow ? 2 : 3" v-if="item.direction === 1">
                                <div class="demo-basic--circle">
                                    <div class="block"><el-avatar :size="40">{{ mine.company.substr(0, 1) }}</el-avatar>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="21" :class="item.direction === 1 ? 'main_left' : 'main_right'">
                                <div class="main_name" v-if="item.direction === 0">
                                    <span class="main-time mr10">{{ dateFormat(item.createTime) }}</span>
                                    <span>{{ item.nickName || userName }}</span>
                                </div>
                                <div class="main_name" v-else>
                                    <span>{{ mine.company }}</span>
                                    <span class="main-time ml10">{{ dateFormat(item.createTime) }}</span>
                                </div>
                                <div class="main_content">
                                    {{ item.chatMessage }}
                                </div>
                            </el-col>
                            <el-col :span="asideShow ? 2 : 3" v-if="item.direction === 0">
                                <div class="demo-basic--circle">
                                    <div class="block"><el-avatar :size="40">{{ item.nickName ? item.nickName.substr(0,
                                        1) : userName.substr(0, 1) }}</el-avatar>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                    </div>
                </div>
                <el-footer>
                    <div class="footer_send">
                        <el-date-picker v-model="chatDate" align="right" type="date" placeholder="选择日期" v-if="asideShow"
                            @change="dateChange" :picker-options="pickerOptions">
                        </el-date-picker>

                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-button type="success" plain>发送</el-button>
                    </div>
                </el-footer>
            </el-container>
        </el-container>
    </div>

</template>

<script>
import { pageMixin } from "@/utils/pageMixin";
import moment from 'moment'
import * as util from '@/utils/util'
export default {
    name: "M-ChatBox",
    created() {
    },
    mixins: [pageMixin],
    props: {
        userName: '',
        asideShow: {
            type: Boolean,
            default: false
        },
        asideItems: [],
        tipsHeight: {
            type: String
        },
        tipsWidth: {
            type: Number,
            default: 200
        },
        boxHeight: {
            type: Number,
            default: 200
        },
        config: {
            type: Object,
            default() {
                return {
                    // 是否有下拉按钮
                    downBtn: true,
                    rightBox: true,
                    // 简约模式
                    brief: true,
                    // 是否开启桌面消息提醒，即在浏览器之外的提醒
                    notice: false,
                    // 设定
                    voice: true,
                    // 上传文件的扩展名
                    fileExt: "",
                    tabRemove: false,
                    fixed: true,
                }
            }
        },
        mine: {
            type: Object,
        }
    },
    data() {
        return {
            circleUrl: "image.png",
            count: 5,
            options: [{
                value: '选项1',
                label: '好的'
            }],
            value: '',
            dialogChatBoxVisible: false,
            msgShow: false,
            describe: "",
            messages: [],
            chatDate: new Date(),
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            highlight: ''
        }
    },
    computed: {
        // list() {
        //     return JSON.parse(JSON.stringify(this.messages))
        // }
    },
    methods: {
        load() {
            // this.count += 2
        },
        dateChange() {
            this.$emit('changAsideItem', this.mine, this.chatDate)
        },
        changAsideItem(e) {
            this.$emit('changAsideItem', e, this.chatDate)
        },
        handleClose(e) {
            // this.dialogChatBoxVisible = false;
            this.$emit('handleClose', e)
            window.v1.close()
        },
        minimize() {
            window.v1.minimize()
        },
        scrollToBottom(height) {
            const container = this.$refs.scrollContainer;
            return container ? (container.scrollTop = height < 0 ? container.scrollHeight : height) : null;
        },
        pushMsgs(items, refresh) {
            if (refresh) {
                this.messages = []
            }

            if (items.length === 1) {
                this.msgShow = items[0].direction === 1 ? true : false;
                this.messages.push(items[0])
                if (this.msgShow) {
                    this.describe = items[0].chatMessage
                }
            } else {
                this.msgShow = false;
                items = items.sort((a, b) => {
                    const dateA = new Date(a.createTime);
                    const dateB = new Date(b.createTime);
                    return dateA - dateB;
                })
                this.messages = this.messages.concat(items)
            }
            this.$nextTick(() => {
                if (this.highlight) {
                    let index = this.messages.filter(item => item.brokerId === this.mine.brokerid && item.channelId === this.mine.channelId).findIndex(item => item.tradeId === this.highlight);
                    this.scrollToBottom(79 * index);
                } else {
                    this.scrollToBottom(-1);
                }
            });
            window.v1 && window.v1.focus()
        },
        dateFormat(date) {
            const padWithZero = (number) => {
                return number < 10 ? '0' + number : number.toString();
            }
            if (date instanceof Object) {
                return `${this.asideShow ? moment(date).format('YYYY-MM-DD') : ''} ${padWithZero(date.hour)}:${padWithZero(date.minute)}:${padWithZero(date.second)}`
            } else {
                const time = new Date(date)
                return `${this.asideShow ? moment(time).format('YYYY-MM-DD') : ''} ${padWithZero(time.getHours())}:${padWithZero(time.getMinutes())}:${padWithZero(time.getSeconds())}`
            }
        }
    },
    mounted() {
        if (window.v1) {
            console.log("111111111111111111")
            window.v1.ipcRenderer().On("window-send", (event, data) => {
                console.log(data)
                this.highlight = data.userTradeId;
                window.v1.focus()
                const asideItem = this.asideItems.find(element => (element.brokerid === data.brokerId && element.channelId === data.channelId));
                this.chatDate = `${util.dateFormat(data.createTime || new Date(), "YYYY-MM-DD")} 00:00:00`;
                this.$emit('changAsideItem', asideItem, this.chatDate)
            })
        }
    }
}

</script>
<style>
.no-header-dialog .el-dialog__header {
    display: none;
}

.no-header-dialog .el-dialog__body {
    padding: 0;
}
</style>
<style lang="scss" scoped>
.chat_tips {
    min-width: 215px;
    min-height: 50px;
    background-color: white;
    margin: 5px;
    display: inline-block;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: relative;
    cursor: pointer;

    .tips-right {
        position: absolute;
        right: 0;
        top: 0;

        i {
            width: 20px;
            height: 20px;
            font-size: 18px;
            line-height: 20px;
            text-align: center;
        }

        i:hover {
            background-color: #b6b4b4;
        }
    }

    .tips_tit {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: normal;
        padding: 0 10px;
        line-height: 25px;
    }

    .tips_name {
        padding: 0 10px;
        line-height: 25px;
    }
}

.chat_tips:hover {
    background-color: #b8b8b8;
}

.chat_box {
    min-width: 500px;
    width: 100%;
    height: 100%;
    margin: 0px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: relative;
    top: unset;
    left: unset;
    border-color: rgba(0, 0, 0, 0.05);
    background-repeat: no-repeat;
    background-color: #F6F6F6;
    color: #333;
    overflow: hidden;

    .chat_header_left {
        max-height: 80px;
        cursor: pointer;
        border-radius: 3px;
        padding: 15px 0;

        .el-avatar {
            line-height: 60px;
        }

        .item_name {
            font-size: 14px;
            text-align: left;
            font-weight: bold;
            width: 100%;
            padding-left: 5px;
            line-height: 25px;
        }

        .item_content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: normal;
            font-size: 12px;
        }
    }

    .chat_item:hover {
        background-color: #D9D9D9;
    }

    .el-aside {
        color: #333;
        text-align: center;
        background-color: #EFEFEF;

        .aside_top {
            height: 20px;
            margin: auto;
        }

        .chat_item {
            max-height: 60px;
            margin: 5px;
            cursor: pointer;
            border-radius: 3px;
            padding: 7px 0;

            .el-avatar {
                vertical-align: middle;
                line-height: 60px;
            }

            .item_name {
                font-size: 14px;
                text-align: left;
                font-weight: bold;
                display: inline-block;
                width: 100%;
                padding-left: 5px;
                line-height: 23px;
            }

            .item_content {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: normal;
                font-size: 12px;
            }
        }
    }

    .el-aside::-webkit-scrollbar {
        width: 0em;
    }

    .el-aside::-webkit-scrollbar-track {
        background-color: transparent;
    }

    .el-aside::-webkit-scrollbar-thumb {
        background-color: transparent;
    }

    .el-header,
    .el-footer {
        color: #333;
        text-align: center;
        position: relative;
    }

    .el-header {
        height: 80px !important;

        .el-divider--horizontal {
            margin: 0px;
        }

        .header-right {
            position: absolute;
            right: 0;
            top: 0;

            i {
                width: 30px;
                height: 30px;
                font-size: 20px;
                line-height: 30px;
                -webkit-app-region: no-drag;
            }

            i:hover {
                color: #f78484;
            }
        }
    }

    .el-footer {
        background-color: #ffffff;

        .footer_send {
            text-align: right;
            line-height: 60px;

            .is-plain {
                display: inline-block;
                font-size: 14px;
                line-height: 32px;
                margin-left: 5px;
                padding: 0 20px;
                background-color: #F5F5F5;
                border: none;
                color: #606060;
                width: 80px;
            }

            .el-select--small>>>.el-input__inner:hover,
            .is-plain:hover {
                background-color: #189100;
                color: #fff;
            }

            .el-select--small>>>.el-input__inner {
                width: 120px;
                background-color: #f5f5f5;
                border: none;
                font-size: 12px;
            }
        }

    }

    .el-main {
        color: #333;
        text-align: center;

        .main_item_highlight {
            background-color: antiquewhite;
        }

        .main_item {
            margin: 5px 10px;
            cursor: pointer;
            border-radius: 3px;
            padding: 5px 0 10px;
            // background-color: antiquewhite;

            .el-avatar {
                vertical-align: middle;
                line-height: 60px;
            }

            .main_left {
                text-align: left;
            }

            .main_right {
                text-align: right;

                .main_content {
                    background-color: #9EEA6A;

                }

                .main_content:after {
                    left: auto;
                    right: -10px;
                    border-top-color: #9EEA6A;
                }
            }

            .main_name {
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
                width: 100%;
                line-height: 25px;

                .main-time {
                    color: #8f8e8e;
                    font-size: 10px;
                }
            }

            .main_content {
                position: relative;
                line-height: 22px;
                padding: 8px 15px;
                background-color: #fff;
                color: #000;
                word-break: break-all;
                max-width: 262px;
                font-weight: normal;
                font-size: 12px;
                text-align: left;
                width: fit-content;
                display: inline-block;
                box-shadow: 0 2px 4px rgb(8 8 8 / 25%), 0 0 6px rgba(0, 0, 0, .04);
                border-radius: 7px;
                border: none;
            }

            .main_content:after {
                content: '';
                position: absolute;
                left: -10px;
                top: 13px;
                width: 0;
                height: 0;
                border-style: solid dashed dashed;
                border-color: #fff transparent transparent;
                overflow: hidden;
                border-width: 10px;
            }
        }
    }

    .el-container {
        height: 100%;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    /* 自定义滚动条的宽度 */
    .el-main::-webkit-scrollbar {
        width: 10px;
        /* 对于水平滚动条 */
        height: 10px;
        /* 对于垂直滚动条 */
    }

    /* 自定义滚动条的背景色 */
    .el-main::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
        /* 滚动条轨道的背景色 */
    }

    /* 自定义滚动条的滑块颜色 */
    .el-main::-webkit-scrollbar-thumb {
        background: #888 !important;
        border-radius: 3px;
        /* 滚动条滑块的背景色 */
    }

    /* 当鼠标悬停在滚动条上时，自定义滑块的颜色 */
    .el-main::-webkit-scrollbar-thumb:hover {
        background: #555 !important;
        /* 滚动条滑块的背景色 */
    }

    /** 设置表格内设的滚动条宽度，适应动态计算 */
    .el-main {
        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
    }

}

.message {
    animation: fadeInOut 2s infinite;
    opacity: 0.5;
    background-color: #f0f0f0;
    border-radius: 5px;
    box-shadow: 0 0 10px #ec0000;
    z-index: 1000;
}

.message.show {
    display: block;
}

@keyframes fadeInOut {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }
}
</style>
