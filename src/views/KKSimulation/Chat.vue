<template>
    <div style="height: 100%;">
        <title-bar>
            <i slot="right_bar" @click="drawer = true" class="el-icon-s-tools noDrag txt-white right_bar"></i>
        </title-bar>
        <div style="background-color: rgb(32, 32, 32);    height: calc(100% - 40px)">
            <el-container class="chat-box">
                <!-- <el-header class="chat-header">
                    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
                        设置
                    </el-button>
                </el-header> -->
                <el-main class="chat-main">
                    <div v-for="item in checkedChats" :key="item.brokerid" class="chat-item">
                        <MChatBox :ref="'MChatBox' + JSON.parse(item).brokerid" :boxHeight="boxHeight" :config="config"
                            :dialogChatBoxVisible="false" :userName="userInfo.userName"
                            @handleClose="handleChatClose(JSON.parse(item))"
                            :messages="chatMessages[JSON.parse(item).brokerid] || []" :mine="JSON.parse(item)">
                        </MChatBox>
                    </div>
                </el-main>
            </el-container>

            <el-drawer direction="ltr" title="" :visible.sync="drawer" :with-header="false" :before-close="handleClose">
                <div>
                    <div class="mt10 mb10 ml10 mr10"><el-alert :closable="false" title="最多只能选中6个消息看板" type="warning">
                        </el-alert></div>
                    <el-checkbox-group v-model="checkedChats" @change="handleCheckedChatsChange" :max="6">
                        <el-card shadow="hover" class="mt10 mb10 ml10 mr10" v-for="item in chats" :key="item.brokerid">
                            <el-checkbox :label="JSON.stringify(item)">{{ item.company }}
                            </el-checkbox>
                        </el-card>
                    </el-checkbox-group>
                </div>
            </el-drawer>
            <main-socket></main-socket>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { commMixin } from '@/utils/commMixin'
import apiAdmin from '@/api/kk_power_admin'
import apiTrade from '@/api/kk_trade'
import apiLogin from '@/api/kk_login'
import MChatBox from '@/components/chat/MChatBox';
import MainSocket from '@/components/Socket.vue'
import * as util from '@/utils/util'
export default {
    mixins: [commMixin],
    components: {
        MChatBox,
        MainSocket
    },
    created() {
        if (window.v1) {
            this.isElectron = window.v1.isElectron()
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'getUserInfo'
        }),
        ...mapState({
            chatMessage: (state) => state.chatMessage,
            socketMain: (state) => state.socketMain,
        })
    },
    watch: {
        chatMessage(item) {
            console.log("::::::::::::", item)
            // if (!this.chatMessages[item.brokerId]) {
            //     this.chatMessages[item.brokerId] = []
            //     // this.$set(this.chatMessages, item.brokerId, item)
            // }
            // this.chatMessages[item.brokerId].push(item)
            if (this.$refs[`MChatBox${item.brokerId}`]) {
                this.$refs[`MChatBox${item.brokerId}`][0].pushMsgs(item);
            }
        },
    },
    data() {
        return {
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
            // 会话
            chats: [],
            checkedChats: [],
            boxHeight: 400,
            isElectron: false,
            drawer: false,
            profile: {},
            chatMessages: {},
        }
    },
    methods: {
        // 获取意向列表
        getIntendComerList() {
            Promise.all([

            ]).then(async () => {
                apiAdmin.chatReceiverList().then(async ({ code, value }) => {
                    this.chats = code === '00000' ? value : []
                })
                const { value } = await apiLogin.getProfile(this.userInfo.userId)
                this.profile = value ? value : {};
                this.checkedChats = (value && value.chats) ? JSON.parse(value.chats) : [];
                console.log(this.checkedChats)
                this.drawer = this.checkedChats.length <= 0;
                const createTime = `${util.dateFormat(new Date(), "YYYY-MM-DD")} 00:00:00`;
                const { value: msgs } = await apiTrade.getChatMessagesByCondition({ createTime })
                this.chatMessages = groupBy(msgs, item => item.brokerId) || {}
            })
        },
        handleCheckedChatsChange(value) {
            console.log(this.checkedChats)
        },
        handleClose() {
            Promise.all([
                this.drawer = false
            ]).then(async () => {
                const userId = this.userInfo.userId;
                const chats = JSON.stringify(this.checkedChats);
                const { value } = await apiLogin.getProfile(this.userInfo.userId)
                await apiLogin.saveProfile({ id: value ? value.id : 0, userId, chats })
            })
        },
        handleChatClose(e) {
            Promise.all([
                this.checkedChats = this.checkedChats.filter(item => JSON.parse(item).brokerid !== e.brokerid)
            ]).then(async () => {
                const userId = this.userInfo.userId;
                const chats = JSON.stringify(this.checkedChats);
                const { value } = await apiLogin.getProfile(this.userInfo.userId)
                await apiLogin.saveProfile({ id: value ? value.id : 0, userId, chats })
            })
        }
    },
    mounted() {
        this.getIntendComerList()
        if (window.v1 && this.isElectron) {
            window.v1.getAllDisplays().then((response) => {
                const maxHeight = Math.max(...response.map(display => display.bounds.height));
                this.boxHeight = (maxHeight - 190) / 3
            });
        } else {
            this.boxHeight = 390
        }
    },

}

const groupBy = (array, key) => {
    return array.reduce((result, currentItem) => {
        // 使用 key 函数提取分组依据，如果不存在则创建对象数组
        const group = key(currentItem);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(currentItem);
        return result;
    }, {});
};
</script>

<style lang="scss" scoped>
.right_bar {
    width: 40px;
    height: 40px;
    font-size: 18px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    -webkit-app-region: no-drag;
}

.chat-box {
    .chat-header {
        background-color: #474747;
        color: #333;
        text-align: center;
        line-height: 40px;
        height: 40px !important;
        text-align: right;
        padding: 0 10px;
    }

    .chat-main {
        // margin-top: 40px;

        .chat-item {
            display: inline-block;
            width: calc(50% - 0px);
        }
    }

}
</style>
