import { _ as _export_sfc, c as createElementBlock, o as openBlock, j as createBaseVNode } from "./chunks/framework.D7BYLF8s.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"linklocation/youhhua.md","filePath":"linklocation/youhhua.md"}');
const _sfc_main = { name: "linklocation/youhhua.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, _cache[0] || (_cache[0] = [
    createBaseVNode("p", null, "1.问秒杀页面渲染架构。我答虚拟列表+请求防抖+预加载。追问：“千万级SKU在DOM里，快速筛选卡死怎么办？”补离屏Canvas渲染+时间切片调度，过关。 考支付排队：10万用户点付款，前端怎么防请求雪崩？答请求队列+指数退避+双Token防重。手写带优先级的请求队列", -1),
    createBaseVNode("p", null, "2.支付流程状态机。我提Redux Toolkit+乐观更新+Saga。打断问：“支付成功但后端超时，怎么保证扣款状态与实际到账最终一致？”答本地事务表+长轮询+UI兜底。 追问：“多笔请求并发返回，竞态条件怎么处理？”手写AbortController取消+操作序列化+最终一致性展示", -1),
    createBaseVNode("p", null, "3.从React Fiber时间切片问到Web Worker离屏计算。最后场景：“支付实时大盘，每秒2000+条数据，怎么保证图表不掉帧？”答WebGL渲染+二进制协议+流式消费+OffscreenCanvas。追问内存监控？补充WeakMap复用+对象池+Long Task监控", -1)
  ]));
}
const youhhua = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  youhhua as default
};
