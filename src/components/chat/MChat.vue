<template>
    <div class="chat_box">
        <el-container>
            <el-aside width="200px">
                <div v-infinite-scroll="load">
                    <div v-for="i in count" class="chat_item" :key="i">
                        <el-row>
                            <el-col :span="8">
                                <div class="demo-basic--circle">
                                    <div class="block"><el-avatar :size="50" :src="circleUrl"></el-avatar></div>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <span class="item_name">中介 {{ i }}</span>
                            </el-col>
                        </el-row>

                    </div>
                </div>
            </el-aside>
            <el-container>
                <el-header></el-header>
                <el-main></el-main>
                <el-footer></el-footer>
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

    .chat_item {
        height: 60px;
        margin: 5px;

        cursor: pointer;
        border-radius: 3px;

        .el-avatar {
            vertical-align: middle;
        }

        .item_name {
            font-size: 14px;
            text-align: left;
            font-weight: bold;
            display: inline-block;
            width: 100%;
            padding-left: 5px;
        }
    }

    .chat_item:hover {
        background-color: #D9D9D9;
    }

    .el-aside {
        color: #333;
        text-align: center;
        line-height: 60px;
        background-color: #EFEFEF;
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
        line-height: 60px;
        background-color: #B3C0D1;
    }

    .el-footer {
        background-color: #ffffff;

    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
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
}
</style>
