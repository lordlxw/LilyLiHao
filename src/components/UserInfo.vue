<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>用户基本信息</span>
        </div>
        <div>
            <el-row>
                <el-col :span="6">
                    <div class="user-info">
                        <el-avatar style="font-size: 16px;">
                            <i class="el-icon-user-solid"></i>
                        </el-avatar>
                        <div class="user-name">{{ userInfo.userName }}</div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="user-details">
                        <el-row :gutter="10">
                            <el-col :span="10" class="detail-item">
                                <span>用户名：</span>
                                <span>{{ userInfo.nickName }}</span>
                            </el-col>
                            <el-col :span="8" class="detail-item">
                                <span>角色：</span>
                                <span>{{ userInfo.roleName }}</span>
                            </el-col>
                            <el-col :span="6" class="detail-item">
                                <span>状态：</span>
                                <span>{{ getStatusStr(userInfo.status || -1) }}</span>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10" class="detail-item">
                                <span>手机号：</span>
                                <span>{{ userInfo.phonenumber || '空' }}</span>
                            </el-col>
                            <el-col :span="8" class="detail-item">
                                <span>邮箱：</span>
                                <span>{{ userInfo.email || '空' }}</span>
                            </el-col>
                            <el-col :span="6" class="detail-item">
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="18" class="detail-item">
                                <span>创建：</span>
                                <span>{{ userInfo.createTime }}</span>
                            </el-col>
                            <el-col :span="6" class="detail-item">
                                <el-link v-if="showInfo" type="info" @click="openMoreThis(`/simulation/dashboard`)">查看更多信息</el-link>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <!-- <el-col :span="6">
                    <div class="user-actions">
                        <el-button type="primary" size="small">编辑信息</el-button>
                        <el-button type="danger" size="small">删除用户</el-button>
                    </div>
                </el-col> -->
            </el-row>
        </div>
    </el-card>
</template>

<script>
export default {
    props: {
        userInfo: {
            type: Object,
            required: true
        },
        showInfo: true
    },
    methods: {
        getStatusStr(status) {
            status = parseInt(status)
            return status === 0 ? '正常' : status === 2 ? '锁定' : status === 3 ? '冻结' : status === 1 ? '预警' : '无数据';
        },
        openMoreThis($path, tscode) {
            console.log(tscode)
            // let $path = '/simulation/klinevertical';
            if (window.v1) {
                window.v1.getAllDisplays().then((response) => {
                    console.log(response)
                    const maxWidth = Math.max(...response.map(display => display.bounds.width));
                    const maxHeight = Math.max(...response.map(display => display.bounds.height));

                    if ($path.includes('/simulation/dashboard')) {
                        // const maxWidth = Math.max(...displays.map(display => display.bounds.width));
                        const minWidth = Math.ceil(maxWidth / 2 + 100);
                        const minHeight = Math.ceil(minWidth * 0.63);
                        const args = {
                            width: minWidth, // 窗口宽度
                            height: minHeight, // 窗口高度
                            isMainWin: false,
                            resize: true, // 是否支持缩放
                            maximize: false, // 最大化窗口
                            isMultiWin: false, // 是否支持多开窗口
                            route: $path,
                            data: {
                                child: true,
                            }
                        }

                        console.log(args)
                        window.v1.createWin(args);
                    } else {
                        const minWidth = maxWidth / 5.5 <= 480 ? 480 : maxWidth / 5.5;
                        const args = {
                            width: minWidth, // 窗口宽度
                            height: maxHeight - 50, // 窗口高度
                            minWidth: minWidth, // 窗口最小宽度
                            maxWidth: minWidth,
                            isMainWin: false,
                            resize: true, // 是否支持缩放
                            maximizable: false, // 最大化窗口
                            isMultiWin: true, // 是否支持多开窗口
                            route: $path,
                            data: {
                                child: true,
                            }
                        }
                        window.v1.createWin(args).then((response) => {
                        }).catch((error) => {
                            // 处理错误
                            console.error(error);
                        });
                    }
                });
            } else {
                const href = this.$router.resolve({
                    path: $path
                }).href;
                window.open(href, "_blank");
            }
        }
    }
}
</script>

<style scoped>
.box-card {
    width: 100%;
    margin-top: 10px;
}

.user-info {
    text-align: center;
    margin-bottom: 10px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.user-name {
    margin-top: 10px;
    font-size: 18px;
}

.user-details {
    margin-top: 10px;
}

.detail-item {
    margin-bottom: 5px;
}

.user-actions {
    text-align: right;
    margin-top: 10px;
}

.el-icon-user-solid {
    font-size: 16px;
}
</style>
