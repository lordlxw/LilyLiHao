<template>
    <div class="custom-title-bar" :style="{
        background: bgColor || backgroundColor,
    }">
        <!-- 这里可以添加 Element UI 组件或其他自定义内容 -->
        <!-- <el-button type="primary">一个按钮</el-button> -->
        <el-row type="flex">
            <el-col :span="16">
                <div class="grid-content-l">
                    <slot name="left_bar" class="slot"></slot>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content-r">
                    <slot name="right_bar" class="slot"></slot>
                    <i @click="minimize" class="el-icon-minus"></i>
                    <i @click="close" class="el-icon-close"></i>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import apiLogin from '@/api/kk_login'
export default {
    name: 'CustomTitleBar',
    props: {
        bgColor: ''
        // 其他自定义属性
    },
    data() {
        return {
            backgroundColor: '#303133'
        }
    },
    watch: {
    },
    methods: {
        minimize() {
            window.v1.minimize()
        },
        close() {
            if (window.v1 && window.v1.isElectron()) {
                window.v1.close()
            } else {
                apiLogin.logout().then(response => {
                    if (response && response.code === 200) {
                        Promise.all([
                            this.$store.commit('SET_TOKEN', null),
                            this.$store.commit('SET_USER_INFO', null)
                        ]).then(() => {
                            this.$router.push({ path: '/' })
                        })
                    } else {
                        this.$message({
                            message: '退出失败',
                            type: 'error'
                        })
                    }
                })
            }
        },
        onPageShow(isfocus) {
            // 在这里编写你的逻辑
            console.log('页面显示或重新激活', isfocus);
        }
    },
    created() {
        console.log('页面显示或重新激活');
        if (window.v1) {
            if (window.v1.isFocusedWindow) {
                if (this.$route.path.includes("klinevertical")) {
                    this.backgroundColor = "#bb9113"
                    // "linear-gradient(135deg, #ff0066, #00ffcc)"
                    // #bb9113
                }
            }
            window.v1.ipcRenderer().On("window-focused", () => {
                if (this.$route.path.includes("klinevertical")) {
                    this.backgroundColor = "#bb9113"
                }
            })
            window.v1.ipcRenderer().On("window-blurred", () => {
                this.backgroundColor = "#303133"
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-title-barhover {
    background-color: #b6b4b4;
}

.custom-title-bar {
    /* 自定义标题栏样式 */
    -webkit-app-region: drag;
    /* 允许区域拖动 */
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    cursor: pointer;

    .el-row {
        width: 100%;
        height: 40px;

        .grid-content-l {
            height: 40px;
            line-height: 40px;

            i .slot {
                -webkit-app-region: no-drag;
            }
        }

        .grid-content-r {
            text-align: end;

            i {
                width: 40px;
                height: 40px;
                font-size: 18px;
                line-height: 40px;
                color: white;
                text-align: center;
                -webkit-app-region: no-drag;
            }

            i:hover {
                color: #f78484;
            }
        }
    }

    /* 其他样式 */
}
</style>
