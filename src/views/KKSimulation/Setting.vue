<template>
    <div style="height: 100%;">
        <title-bar>
        </title-bar>
        <div>
            <el-tabs tab-position="left" style="height: 550px;">
                <el-tab-pane label="窗口配置">
                    <div class="pane-box custom-scrollbar">
                        <el-collapse v-model="activeWin" accordion>
                            <el-collapse-item title="主窗口" name="1">
                                <div>
                                    <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                                        <el-form-item label="活动区域">
                                            <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
                                                <el-option label="区域一" value="shanghai"></el-option>
                                                <el-option label="区域二" value="beijing"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="活动性质">
                                            <el-checkbox-group v-model="sizeForm.type">
                                                <el-checkbox-button label="风控模块" name="type"></el-checkbox-button>
                                                <el-checkbox-button label="询价模块" name="type"></el-checkbox-button>
                                                <el-checkbox-button label="以平模块" name="type"></el-checkbox-button>
                                                <el-checkbox-button label="未平模块" name="type"></el-checkbox-button>
                                                <el-checkbox-button label="交易统计" name="type"></el-checkbox-button>
                                            </el-checkbox-group>
                                        </el-form-item>
                                        <el-form-item size="large">
                                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                                            <el-button>取消</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="交易窗口 A" name="2">
                                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                            </el-collapse-item>
                            <el-collapse-item title="交易窗口 B" name="3">
                                <div>简化流程：设计简洁直观的操作流程；</div>
                                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                            </el-collapse-item>
                            <el-collapse-item title="聊天窗口 A" name="4">
                                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                            </el-collapse-item>
                            <el-collapse-item title="聊天窗口 B" name="5">
                                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                            </el-collapse-item>
                            <el-collapse-item title="聊天窗口 C" name="6">
                                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="交易配置">
                    <div class="pane-box custom-scrollbar">

                    </div>
                </el-tab-pane>
                <el-tab-pane label="角色管理">
                    <div class="pane-box custom-scrollbar">

                    </div>
                </el-tab-pane>
                <el-tab-pane label="交易日志">
                    <div class="pane-box custom-scrollbar">
                        <el-timeline>
                            <el-timeline-item timestamp="2018/4/12" placement="top">
                                <el-card>
                                    <h4>T0004 240205 ofr 2.325 10000 今天+0</h4>
                                    <p>测试 2018/4/12 20:46</p>
                                </el-card>
                            </el-timeline-item>
                            <el-timeline-item timestamp="2018/4/3" placement="top">
                                <el-card>
                                    <h4>OK</h4>
                                    <p>国利 2018/4/3 20:46</p>
                                </el-card>
                            </el-timeline-item>
                            <el-timeline-item timestamp="2018/4/2" placement="top">
                                <el-card>
                                    <h4>T0004 240205 ofr 2.325 10000 今天+0</h4>
                                    <p>测试 2018/4/2 20:46</p>
                                </el-card>
                            </el-timeline-item>
                            <el-timeline-item timestamp="2018/4/2" placement="top">
                                <el-card>
                                    <h4>要了 240205 2.3250 10000 7.17+0</h4>
                                    <p>中诚 2018/4/2 20:46</p>
                                </el-card>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>

<script>
export default {
    name: 'main-setting',
    props: {},
    data() {
        return {
            activeWin: '1',
            sizeForm: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
    },
    mounted() { }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

>>>.el-tabs__header {
    padding: 10px 0;
}

.pane-box {
    padding: 10px 10px;
    height: 550px;
}
</style>
