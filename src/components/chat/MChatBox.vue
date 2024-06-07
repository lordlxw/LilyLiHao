<template>
    <div>
        <div class="chat_box" @click="() => { msgShow = false }" :class="msgShow ? 'message show' : ''"
            :style="{ height: boxHeight + 'px' }">
            <el-container>
                <el-aside width="200px" v-if="asideShow">
                    <div class="aside_top"></div>
                    <div v-infinite-scroll="load">
                        <div v-for="i in count" class="chat_item" :key="i">
                            <el-row>
                                <el-col :span="8">
                                    <div class="demo-basic--circle">
                                        <div class="block"><el-avatar :size="46" :src="circleUrl"></el-avatar></div>
                                    </div>
                                </el-col>
                                <el-col :span="16">
                                    <div class="item_name">中介 {{ i }}</div>
                                    <el-tooltip class="item" effect="dark" content="bid 240004 2k 06月03日+0 2.3160"
                                        placement="top-start">
                                        <div class="item_name item_content">bid 240004 2k 06月03日+0 2.3160</div>
                                    </el-tooltip>
                                </el-col>
                            </el-row>

                        </div>
                    </div>
                </el-aside>
                <el-container>
                    <el-header>
                        <el-row>
                            <el-col :span="8" class="chat_header_left">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="demo-basic--circle">
                                            <div class="block"><el-avatar :size="50" :src="circleUrl"></el-avatar>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="16">
                                        <div class="item_name">中介 1</div>
                                        <el-tooltip class="item" effect="dark" content="bid 240004 2k 06月03日+0 2.3160"
                                            placement="top-start">
                                            <div class="item_name item_content">bid 240004 2k 06月03日+0 2.3160</div>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="16">
                            </el-col>
                        </el-row>
                        <div class="header-right">
                            <i class="el-icon-minus"></i>
                            <i @click="closeDialog" class="el-icon-close"></i>
                        </div>
                        <el-divider></el-divider>
                    </el-header>
                    <el-main>
                        <div v-for="i in chats" class="main_item" :key="i">
                            <el-row>
                                <el-col :span="3" v-if="i % 2 === 0">
                                    <div class="demo-basic--circle">
                                        <div class="block"><el-avatar :size="40" :src="circleUrl"></el-avatar></div>
                                    </div>
                                </el-col>
                                <el-col :span="21" :class="i % 2 === 0 ? 'main_left' : 'main_right'">
                                    <div class="main_name">中介 {{ i }}</div>
                                    <div class="main_content">
                                        测试123123，测试123123测试123123测试123123测试123123测试123123测试123123测试123123测试123123测试123123测试123123测试123123测试123123
                                    </div>
                                </el-col>
                                <el-col :span="3" v-if="i % 2 === 1">
                                    <div class="demo-basic--circle">
                                        <div class="block"><el-avatar :size="40" :src="circleUrl"></el-avatar></div>
                                    </div>
                                </el-col>
                            </el-row>

                        </div>
                    </el-main>
                    <el-footer>
                        <div class="footer_send">
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
    </div>

</template>

<script>

export default {
    name: "M-ChatBox",
    created() {
    },
    props: {
        asideShow: {
            type: Boolean,
            default: false
        },
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
        chats: {
            type: Array,
            default() {
                return []
            }
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
            default() {
                return {
                    // 昵称
                    username: "七月",
                    // 用户id
                    id: "10001",
                    // 状态
                    status: "online",
                    // 签名
                    sign: "与其感慨路难行,不如马上出发！",
                    avatar: '',

                }
            }
        }
    },
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            count: 5,
            // chats: [],
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: '',
            dialogChatBoxVisible: false,
            msgShow: false

        }
    },
    methods: {
        load() {
            // this.count += 2
        },
        closeDialog() {
            this.dialogChatBoxVisible = false;
        }
    },
    mounted() {
        this.msgShow = this.chats.length > 0 ? true : false;
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
    width: -webkit-fill-available;
    margin: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: relative;
    top: unset;
    left: unset;
    border: 1px solid #D9D9D9;
    border-color: rgba(0, 0, 0, 0.05);
    background-repeat: no-repeat;
    background-color: #F6F6F6;
    color: #333;

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

        // .aside_top{
        //     height: 80px;
        //     margin: auto;
        //     background-color: #fff;
        // }

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
            }

            i:hover {
                background-color: #b6b4b4;
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

        .main_item {
            margin: 5px;
            cursor: pointer;
            border-radius: 3px;
            padding: 5px 0;

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
            }

            .main_content {
                position: relative;
                line-height: 22px;
                padding: 8px 15px;
                background-color: #fff;
                border-radius: 3px;
                color: #000;
                word-break: break-all;
                max-width: 262px;
                border: solid 1px #EDEDED;
                font-weight: normal;
                font-size: 12px;
                text-align: left;
                width: fit-content;
                display: inline-block;
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
