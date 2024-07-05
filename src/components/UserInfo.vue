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
                            <el-col :span="12" class="detail-item">
                                <span>创建：</span>
                                <span>{{ userInfo.createTime }}</span>
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
        }
    },
    methods: {
        getStatusStr(status) {
            status = parseInt(status)
            return status === 0 ? '正常' : status === 2 ? '锁定' : status === 3 ? '冻结' : status === 1 ? '预警' : '无数据';
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
