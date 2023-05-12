// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-pxtorem": {
      "rootValue": 192, // 设计稿宽度的1/10
      "propList": ["*"] // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
    },
    // "postcss-px-to-viewport": {
    //   viewportWidth: 1920, //  视窗的宽度，对应的是我们设计稿的宽度，移动端一般是750，如果是pc端那就是类似1920这样的尺寸
    //   viewportHeight: '', // 视窗的高度，移动端一般指定1334，也可以不配置
    //   unitPrecision: 5, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    //   viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
    //   selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
    //   minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
    //   mediaQuery: false // 允许在媒体查询中转换`px`
    // }
  }
}
