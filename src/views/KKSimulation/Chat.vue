<template>
    <div style="background-color: rgb(32, 32, 32);    height: -webkit-fill-available;">
        <el-row>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :mine="mine"></MChatBox>
            </el-col>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :chats="chats"
                    :mine="mine"></MChatBox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :mine="mine"
                    :chats="chats"></MChatBox>
            </el-col>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :mine="mine"></MChatBox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :mine="mine"></MChatBox>
            </el-col>
            <el-col :span="12">
                <MChatBox :boxHeight="boxHeight" :config="config" :dialogChatBoxVisible="false" :chats="chats"
                    :mine="mine"></MChatBox>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import { commMixin } from '@/utils/commMixin'
import MChatBox from '../../components/chat/MChatBox';
export default {
    mixins: [commMixin],
    components: {
        MChatBox
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
            chats: [1, 2, 3, 4, 5],
            // chats: [],
            boxHeight: 400

        }
    },
    mounted() {
        if (window.v1 && window.v1.isElectron()) {
            window.v1.getAllDisplays().then((response) => {
                const maxHeight = Math.max(...response.map(display => display.bounds.height));
                this.boxHeight = (maxHeight - 150) / 3
            });
        } else {
            this.boxHeight = 400
        }
    }
}
</script>

<style>
.chat-box {
    display: inline-block;
}
</style>
