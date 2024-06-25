<template>
    <div class="custom-title-bar" :style="{
        backgroundColor: backgroundColor,
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
export default {
    name: 'CustomTitleBar',
    props: {
        backgroundColor: {
            type: String,
            default: '#303133' // 默认背景色
        },
        // 其他自定义属性
    },
    methods: {
        minimize() {
            window.v1.minimize()
        },
        close() {
            window.v1.close()
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
            line-height: 40px;i
            .slot {
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
