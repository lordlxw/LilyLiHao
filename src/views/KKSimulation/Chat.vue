<template>
    <div style="height: 100%;">
        <div style="background-color: rgb(32, 32, 32);    height: 100%">
            <el-container class="chat-box">
                <el-main class="chat-main">
                    <div class="chat-item">
                        <MChatBox :ref="'MChatBox'" :boxHeight="boxHeight" :config="config" :asideShow="true"
                            @dateChange="dateChange" :asideItems="asideItems" :dialogChatBoxVisible="false"
                            :userName="userInfo.userName" @changAsideItem="changAsideItem" @handleClose="() => { }"
                            :mine="asideItem">
                        </MChatBox>
                    </div>
                </el-main>
            </el-container>
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
import MainSocket from '@/components/SocketElectron.vue'
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
        }),
        brokerid() {
            return this.$route.query.brokerid;
        },
        channelId() {
            return this.$route.query.channelId;
        },
    },
    watch: {
        chatMessage(item) {
            console.log("::::::::::::", item)
            // eslint-disable-next-line eqeqeq
            if (this.brokerid == item.brokerId && this.$refs[`MChatBox`]) {
                this.$refs[`MChatBox`].pushMsgs([item]);
            } else {
                this.initChatMessages();
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
            asideItem: {
                company: ''
            },
            boxHeight: 400,
            isElectron: false,
            profile: {},
            chatMessages: {},
            asideItems: [],
            userInfos: [],
            chatDate: ""
        }
    },
    methods: {
        dateChange(e) {
            this.chatDate = e
            this.initChatMessages(e);
        },
        changAsideItem(asideItem, chatDate) {
            this.asideItem = asideItem;
            this.chatDate = chatDate;
            this.initChatMessages(this.chatDate);
        },
        getIntendComerList() {
            Promise.all([

            ]).then(async () => {
                apiAdmin.chatReceiverList().then(async ({ code, value }) => {
                    if (code === '00000' && value) {
                        // eslint-disable-next-line eqeqeq
                        this.asideItems = value;
                        this.asideItem = this.brokerid ? value.filter(n => (n.brokerid === this.brokerid))[0] : value[0];
                        this.initChatMessages();
                    }
                })
                const { value } = await apiLogin.getProfile(this.userInfo.userId)
                this.profile = value ? value : {};
            })
        },
        initChatMessages(date) {
            Promise.all([

            ]).then(async () => {
                const createTime = `${util.dateFormat(date || new Date(), "YYYY-MM-DD")} 00:00:00`;
                const { value: msgs } = await apiTrade.getSysChatMessagesByCondition({ createTime, brokerId: this.asideItem.brokerid })
                const messages = msgs.map(n => {
                    const user = this.userInfos.find(element => element.userId === n.chatId);
                    return { ...n, nickName: user ? user.nickName : '未知' }
                })
                this.$refs[`MChatBox`].pushMsgs(messages, true);
            })
        },
        getUserSummarys() {
            apiAdmin.getUserSummarys({
                roles: [3]
            }).then(async ({ code, value }) => {
                if (code === '00000') {
                    this.userInfos = value;
                    this.getIntendComerList()
                }
            })
        }

    },
    mounted() {
        this.getUserSummarys()
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
    height: 100%;

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
        height: 100%;
        overflow: hidden;

        .chat-item {
            height: 100%;
            width: 100%;
            display: inline-block;
        }
    }

}
</style>
