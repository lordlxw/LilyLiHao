<template>
    <div class="chat_box">
        <el-container>
            <el-aside width="200px">
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
                                        <div class="block"><el-avatar :size="50" :src="circleUrl"></el-avatar></div>
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
                    <el-divider></el-divider>
                </el-header>
                <el-main>
                    <div v-for="i in count" class="main_item" :key="i">
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
</template>

<script>
export default {
    name: "M-Chat",
    created() {
    },
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            // 获取主面板列表信息，下文会做进一步介绍
            config: {
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
            },
            // 我的信息
            mine: {
                // 昵称
                username: "七月",
                // 用户id
                id: "10001",
                // 状态
                status: "online",
                // 签名
                sign: "与其感慨路难行,不如马上出发！",
                avatar: '',
            },
            // 会话
            chats: [],
            count: 0,
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
            value: ''

        }
    },
    methods: {
        load() {
            this.count += 2
        }
    }
}
</script>

<style lang="scss" scoped>
.chat_box {
    min-width: 500px;
    width: 800px;
    height: 500px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: absolute;
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
        width: 0.5em;
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

            .el-select--small >>> .el-input__inner:hover,
            .is-plain:hover {
                background-color: #189100;
                color: #fff;
            }

            .el-select--small >>> .el-input__inner {
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
</style>
