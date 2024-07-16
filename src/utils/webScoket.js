import * as util from "@/utils/util";
import Router from "@/router";

const self = this;
const h = self.$createElement;
let notify = null;

// 使用策略模式优化
const strategy = {
  bid: function(msgJson, state) {
    console.log("", state);
  },
  // 交易员待接收询价单（买）
  // 交易员待接收询价单（卖）
  delegate_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
    if (msgJson.actionType === "refresh") {
      return;
    }
    notify = self.$notify({
      title: `${msgJson.data.createUserName} 发起询价单`,
      dangerouslyUseHTMLString: true,
      position: "bottom-left",
      message: h("div", { class: "notify" }, [
        h("dl", null, [
          h("dt", null, "创建时间"),
          h("dd", null, `${msgJson.data.createTime}`)
        ]),
        h("dl", null, [
          h("dt", null, "债券码"),
          h("dd", null, `${msgJson.data.tscode}`)
        ]),
        h("dl", null, [
          h("dt", null, "方向"),
          h(
            "dd",
            null,
            `${
              msgJson.data.direction === "bond_0"
                ? "买入"
                : msgJson.data.direction === "bond_1"
                ? "卖出"
                : ""
            }`
          )
        ]),
        h("dl", null, [
          h("dt", null, "询价"),
          h("dd", null, `${util.moneyFormat(msgJson.data.price, 4)}`)
        ]),
        h("dl", null, [
          h("dt", null, "允许最差价格"),
          h(
            "dd",
            null,
            `${util.moneyFormat(
              msgJson.data.direction === "bond_0"
                ? msgJson.data.price - msgJson.data.worstPrice / 100
                : msgJson.data.price + msgJson.data.worstPrice / 100,
              4
            )}`
          )
        ]),
        h("dl", null, [
          h("dt", null, "询量"),
          h("dd", null, `${msgJson.data.volume}`)
        ]),
        h("dl", null, [
          h("dt", null, "交割日期"),
          h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
        ]),
        h("dl", { style: "margin-top:20px;" }, [
          // h("dt", null, ""),
          h("dd", null, [
            h(
              "button",
              {
                class: "notigy-agree",
                on: {
                  click: function() {
                    self.handleAcceptEnquiryClick(msgJson.data, timestamp);
                  }
                }
              },
              "接收并复制"
            ),
            h(
              "button",
              {
                class: "notigy-cancel",
                on: {
                  click: function() {
                    self.handleNotAcceptEnquiryClick(msgJson.data, timestamp);
                  }
                }
              },
              "拒收"
            )
          ])
        ])
      ]),
      duration: 0
    });
    self.notifyRejection[timestamp] = notify;
    self.tryPlay();
  },
  accept_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
  },
  error: function(msgJson, state) {
    if (msgJson.data.errorCode === "0001") {
      if (window.v1 && window.v1.isElectron()) {
        window.v1.restart();
      } else {
        Router.push({ path: "/login" });
      }
    }
  },
  deal_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
    if (msgJson.actionType === "refresh") {
      return;
    }
    self.$notify({
      title: `${msgJson.data.tradeuser} 已成交`,
      dangerouslyUseHTMLString: true,
      position: "bottom-left",
      message: `
        <div class="notify">
          <dl>
            <dt>债券码</dt>
            <dd>${msgJson.data.tscode}</dd>
          </dl>
          <dl>
            <dt>方向</dt>
            <dd>${
              msgJson.data.direction === "bond_0"
                ? "买入"
                : msgJson.data.direction === "bond_1"
                ? "卖出"
                : ""
            }</dd>
          </dl>
          <dl>
            <dt>成交价</dt>
            <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
          </dl>
          <dl>
            <dt>成交量</dt>
            <dd>${msgJson.data.volume}</dd>
          </dl>
          <dl>
            <dt>交割日期</dt>
            <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
          </dl>
        </div>
        `,
      duration: 0
    });
    self.tryPlay();
  },
  deny_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
    if (msgJson.actionType === "refresh") {
      return;
    }
    self.$notify({
      title: `${msgJson.data.tradeuser} 已拒收`,
      dangerouslyUseHTMLString: true,
      position: "bottom-left",
      customClass: "notify-yellow",
      message: `
        <div class="notify">
          <dl>
            <dt>债券码</dt>
            <dd>${msgJson.data.tscode}</dd>
          </dl>
          <dl>
            <dt>方向</dt>
            <dd>${
              msgJson.data.direction === "bond_0"
                ? "买入"
                : msgJson.data.direction === "bond_1"
                ? "卖出"
                : ""
            }</dd>
          </dl>
          <dl>
            <dt>成交价</dt>
            <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
          </dl>
          <dl>
            <dt>成交量</dt>
            <dd>${msgJson.data.volume}</dd>
          </dl>
          <dl>
            <dt>交割日期</dt>
            <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
          </dl>
        </div>
        `,
      duration: 0
    });
    self.tryPlay();
  },
  // 直接撤单
  cancel_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
  },
  // 直接撤单
  delegate_feedback_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
  },
  // 成交确认
  confirmdeal_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
    if (msgJson.actionType === "refresh") {
      return;
    }
    notify = self.$notify({
      title: `${msgJson.data.ut.createuser} 已确认成交`,
      dangerouslyUseHTMLString: true,
      position: "bottom-left",
      message: h("div", { class: "notify" }, [
        h("dl", null, [
          h("dt", null, "债券码"),
          h("dd", null, `${msgJson.data.ut.tscode.replace(/.IB/, "")}`)
        ]),
        h("dl", null, [
          h("dt", null, "方向"),
          h(
            "dd",
            null,
            `${
              msgJson.data.ut.direction === "bond_0"
                ? "买入"
                : msgJson.data.ut.direction === "bond_1"
                ? "卖出"
                : " "
            }`
          )
        ]),
        h("dl", null, [
          h("dt", null, "成交价"),
          h("dd", null, [
            h(
              "span",
              {
                style:
                  "text-decoration: line-through #ec0000; padding-right:5px;"
              },
              msgJson.data.compareResult.fieldlist.indexOf("price") !== -1
                ? util.moneyFormat(msgJson.data.ut.price, 4) + " "
                : ""
            ),
            h(
              "span",
              msgJson.data.compareResult.fieldlist.indexOf("price") !== -1
                ? { style: "color:#ec0000" }
                : null,
              util.moneyFormat(msgJson.data.dto.price, 4)
            )
          ])
        ]),
        h("dl", null, [
          h("dt", null, "成交量"),
          h("dd", null, [
            h(
              "span",
              {
                style:
                  "text-decoration: line-through #ec0000; padding-right:5px;"
              },
              msgJson.data.compareResult.fieldlist.indexOf("volume") !== -1
                ? msgJson.data.ut.volume + " "
                : ""
            ),
            h(
              "span",
              msgJson.data.compareResult.fieldlist.indexOf("volume") !== -1
                ? { style: "color:#ec0000" }
                : null,
              msgJson.data.dto.volume
            )
          ])
        ]),
        h("dl", null, [
          h("dt", null, "交割日期"),
          h("dd", null, [
            h(
              "span",
              {
                style:
                  "text-decoration: line-through #ec0000; padding-right:5px;"
              },
              msgJson.data.compareResult.fieldlist.indexOf("deliveryTime") !==
                -1
                ? msgJson.data.ut.deliveryTime.substr(0, 10) + " "
                : ""
            ),
            h(
              "span",
              msgJson.data.compareResult.fieldlist.indexOf("deliveryTime") !==
                -1
                ? { style: "color:#ec0000" }
                : null,
              msgJson.data.dto.deliveryTime.substr(0, 10)
            )
          ])
        ])
      ]),
      duration: 0
    });
    self.tryPlay();
  },
  // 撤单确认
  request_cancel_bond: function(msgJson, state) {
    console.log("", state);
    self.$store.commit(
      "SET_ENQUIRY_INFO",
      new Date().getTime() + "-" + Math.random(100000)
    );
    if (msgJson.actionType === "refresh") {
      return;
    }
    notify = self.$notify({
      title: `${msgJson.data.createuser} 发起撤单`,
      dangerouslyUseHTMLString: true,
      position: "bottom-left",
      customClass: "notify-yellow",
      message: h("div", { class: "notify" }, [
        h("dl", null, [
          h("dt", null, "创建时间"),
          h("dd", null, `${msgJson.data.createTime}`)
        ]),
        h("dl", null, [
          h("dt", null, "债券码"),
          h("dd", null, `${msgJson.data.tscode}`)
        ]),
        h("dl", null, [
          h("dt", null, "方向"),
          h(
            "dd",
            null,
            `${
              msgJson.data.direction === "bond_0"
                ? "买入"
                : msgJson.data.direction === "bond_1"
                ? "卖出"
                : ""
            }`
          )
        ]),
        h("dl", null, [
          h("dt", null, "成交价"),
          h("dd", null, `${util.moneyFormat(msgJson.data.price, 4)}`)
        ]),
        h("dl", null, [
          h("dt", null, "成交总量"),
          h("dd", null, `${msgJson.data.volume}`)
        ]),
        h("dl", null, [
          h("dt", null, "已成交"),
          h("dd", null, `${msgJson.data.realVolume}`)
        ]),
        h("dl", null, [
          h("dt", null, "未成交"),
          h("dd", null, `${msgJson.data.restVolume}`)
        ]),
        h("dl", null, [
          h("dt", null, "交割日期"),
          h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
        ]),
        h("dl", { style: "margin-top:20px;" }, [
          // h("dt", null, ""),
          h("dd", null, [
            h(
              "button",
              {
                class: "notigy-agree",
                on: {
                  click: function() {
                    self.handleInquiryCancelConfirmClick(
                      msgJson.data.userTradeId,
                      timestamp
                    );
                  }
                }
              },
              "同意"
            ),
            h(
              "button",
              {
                class: "notigy-cancel",
                on: {
                  click: function() {
                    self.handleInquiryCancelRejectionClick(
                      msgJson.data.userTradeId,
                      timestamp
                    );
                  }
                }
              },
              "拒绝"
            )
          ])
        ])
      ]),
      duration: 0
    });
    self.notifyRejection[timestamp] = notify;
    self.tryPlay();
    // if (self.dialogTableVisible) {
    //   self.$refs.tradeEnquiry.loadInitData()
    // }
  }
};

// eslint-disable-next-line no-unused-vars
class LilyScoket {
  constructor(msgJson, strategyKey, state) {
    strategy[strategyKey](msgJson, state);
  }
}
