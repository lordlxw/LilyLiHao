<template>
    <div class="mt20" style="padding: 0 15px;">
        <MChat ref="mchat" :config="config" :chats="chats" :mine="mine" ></MChat>
    </div>
</template>

<script>
import { commMixin } from '@/utils/commMixin'
import MChat from '../../components/chat/MChat';
export default {
    mixins: [commMixin],
    components: {
        MChat
    },
    created() {
        this.initFrameH('breakH', 200)
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
            // chats: [],

        }
    }
}
</script>

<style></style>
