<template>
    <!-- <li class="trans_item" v-if="!source.unToday" :class="funcSelectColor(source.dealtype)"
        style="height: 20px; line-height: 20px" @dblclick="changeForm(source.tradeprice, source.brokerid)">
        <span class="colume1"><span>{{ source.dealtype }}</span></span>
        <span class="colume2">{{
            source.tradeprice | moneyFormat(4)
        }}</span>
        <span class="colume3">{{ source.brokerName }}</span>
        <span class="colume4">{{ source.tradetime }}</span>
    </li> -->

    <el-row v-if="(source.forwardcontact ? showForward : true)"
        :class="funcSelectColor(source.dealtype)" class="trans-body-item" style="height: 24px; line-height: 24px"
        @click.native="changeForm(source.tradeprice, source.brokerid)">
        <el-col :span="4">
            <div class="grid-content ">
                <span>{{ source.dealtype }}</span>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content ">{{ source.tradetime }}</div>
        </el-col>
        <el-col :span="5">
            <div class="grid-content ">{{
                source.tradeprice | moneyFormat(4)
                }}</div>
        </el-col>
        <el-col :span="5">
            <div class="grid-content ">{{ source.settleSpeed || '无' }}</div>
        </el-col>
        <el-col :span="4">
            <div class="grid-content colume1">
                <span :style="{ background: spanBgColor(source.brokerid) }">{{ source.brokerName }}</span>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'r-trans-item',
    props: {
        index: { // 每一行的索引
            type: Number
        },
        // source就是items中的每一条数据，items是从接口接到的数据（这里items是一个数组，数组中的每个元素是一个对象，每个对象有id、title两个属性）
        source: {
            type: Object,
            default: () => { }
        },
        changeForm: {
            type: Function,
        },
        showForward: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        // 根据主动方显示颜色
        funcSelectColor(dealtype) {
            switch (dealtype) {
                case 'GVN':
                    return 'txt-red'
                case 'TKN':
                    return 'txt-green'
                case 'TRD':
                case 'REF':
                    return 'txt-orange'
                default:
                    return 'txt-orange'
            }
        },
        spanBgColor(brokerid) {
            switch (brokerid) {
                case 1:
                    return '#03a9f4'
                case 2:
                    return '#009688'
                case 3:
                    return '#ffc107'
                case 4:
                    return '#ff5722'
                case 5:
                    return '#9e9e9e'
                case 6:
                    return '#607d8b'
                case 11:
                    return '#e91e63'
                case 12:
                    return '#f44336'
                default:
                    return 'txt-orange'
            }
        }
    },
    mounted() { }
}
</script>
<style>
.trans-body-item:hover {
    background-color: rgb(90, 90, 90);
}

.colume1 span {
    min-width: 30px;
    width: 45px;
    border-radius: 2px;
    display: inline-block;
    background-color: #289c89;
    height: 20px;
    line-height: 20px;
    color: white;
    font-size: 14px
}

.grid-content {
    text-align: center;
    font-weight: bold;
    font-family: fangsong;
    font-size: 14px !important;
}

.grid-content span {
    font-size: 14px
}

/* .colume2 {
    min-width: 30px;
    text-align: center;
}

.colume3 {
    min-width: 30px;
    text-align: center;
}

.colume4 {
    min-width: 30px;
    text-align: center;
} */
</style>
