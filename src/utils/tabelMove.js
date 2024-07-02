import Vue from "vue";
// tabel左右拖动效果
Vue.directive("swipe-copy", {
  // 指令的定义
  bind: function(el, binding, vnode) {
    var odiv = el; // 获取当前表格元素
    // el.style.cursor = 'pointer'

    el.querySelector(".el-table .el-table__body-wrapper").style.cursor =
      "pointer";

    var mouseDownAndUpTimer = null;
    var mouseOffset = 0;
    var mouseFlag = false;
    odiv.onmousedown = e => {
      const ePath = composedPath(e);
      // 拖拽表头不滑动
      if (
        ePath.some(res => {
          return (
            res &&
            res.className &&
            res.className.indexOf("el-table__header") > -1
          );
        })
      ) {
        return;
      }

      if (e.which !== 1) return;

      mouseOffset = e.clientX;
      mouseDownAndUpTimer = setTimeout(function() {
        mouseFlag = true;
      }, 80);
    };
    odiv.onmouseup = e => {
      setTimeout(() => {
        // vnode.context:当前的vm实例 -- 渲染表格
        vnode.context.$refs.orderTable &&
          vnode.context.$refs.orderTable.doLayout();
      }, 200);
      if (mouseFlag) {
        mouseFlag = false;
      } else {
        clearTimeout(mouseDownAndUpTimer); // 清除延迟时间
      }
    };
    odiv.onmouseleave = e => {
      setTimeout(() => {
        // vnode.context:当前的vm实例 --  渲染表格
        vnode.context.$refs.orderTable &&
          vnode.context.$refs.orderTable.doLayout();
      }, 200);
      mouseFlag = false;
    };
    odiv.onmousemove = e => {
      if (e.which !== 1) return;

      const divData = odiv.querySelector(".el-table .el-table__body-wrapper");
      if (mouseFlag && divData) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= -mouseOffset + (mouseOffset = e.clientX);
      }
    };
    // 解决有些时候,在鼠标松开的时候,元素仍然可以拖动;
    odiv.ondragstart = e => {
      e.preventDefault();
    };
    odiv.ondragend = e => {
      e.preventDefault();
    };
    // 点击复制
    odiv.onclick = e => {};

    odiv.addEventListener("dblclick", function(e) {
      // e.preventDefault(); // 防止默认双击选中文本的行为
      vnode.context[binding.expression].apply(null, [e]); // 调用方法
    });
    // 是否选中文字
    odiv.onselectstart = () => {
      return false;
    };
    function composedPath(e) {
      // 存在则直接return
      if (e.path) {
        return e.path;
      }
      // 不存在则遍历target节点
      let target = e.target;
      e.path = [];
      while (target.parentNode !== null) {
        e.path.push(target);
        target = target.parentNode;
      }
      // 最后补上document和window
      e.path.push(document, window);
      return e.path;
    }
  }
});

// 拦截 Element.Notification 的方法
Vue.prototype.$notify = (function(notify) {
  return function(options) {
    console.log("拦截 Element.Notification 的方法", window.location.href)
    if (window.location.href.includes("chatitem")) {
      return;
    }
    // 调用原始的 $notify 方法
    return notify.apply(this, arguments);
  };
})(Vue.prototype.$notify);
