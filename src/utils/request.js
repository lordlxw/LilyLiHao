import axios from "axios";
import Router from "@/router";
import { Message } from "element-ui";
import configUtil from "@/utils/config.js";

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API,
  // baseURL: Vue.prototype.$apiUrl,
  timeout: 30000,

});

service.interceptors.request.use(config => {
  try {
    config.headers["Agent"] = " _BondHelper";
    console.log("get:" + localStorage.getItem(configUtil.keys.tokenKey));
    if (
      localStorage.getItem(configUtil.keys.tokenKey) &&
      !["/login", "/verifyToken"].includes(
        config.url.substring(config.url.lastIndexOf("/"))
      )
    ) {
      config.headers["Authorization"] = localStorage.getItem(
        configUtil.keys.tokenKey
      );
    }
  } catch (error) {}
  return config;
});

service.interceptors.response.use(
  response => {
    console.log(response.config.url);
    console.log(response);
    // if (response.data === 'OK') {
    //   return true
    // }
    const resp = response.data;
    // console.log(JSON.stringify(resp))
    switch (resp.code) {
      case 200:
      case "00000":
        return resp;
      case 401:
        // Message({
        //   message: '登录超时，请重新登录',
        //   type: 'warning',
        //   durations: 3 * 1000
        // })
        Router.push({ path: "/login" });
        break;
      default:
        // if (response.request && response.request.responseType === 'arraybuffer') {
        //   return resp
        // }
        return resp;
      // Message({
      //   message: `${resp.message}`,
      //   type: 'warning',
      //   durations: 3 * 1000
      // })
      // break
    }
  },
  error => {
    console.log(error);
    if (error.toString().indexOf("401") !== -1) {
      Router.push({ path: "/login" });
      Message({
        message: "登录超时，请重新登录",
        type: "warning",
        durations: 3 * 1000
      });
    } else if (error.toString().indexOf("500") !== -1) {
      Message({
        message: "服务器异常（500）",
        type: "warning",
        durations: 3 * 1000
      });
    } else if (error.toString().indexOf("400") !== -1) {
      Message({
        message: `${error.response.data.message}`,
        type: "warning",
        durations: 3 * 1000
      });
    }
    if (error.toString().indexOf("Error: Network Error") !== -1) {
      Message({
        message: `网络错误，无法链接`,
        type: "warning",
        durations: 3 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
