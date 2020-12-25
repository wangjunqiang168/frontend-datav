module.exports = {
  title: '中移在线数据可视化',
  base: '/datav-docs/',
  description: '数据可视化开发文档',
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: false },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2, 3] },
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: `favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#1890ff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    lastUpdated: '上次更新',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'SmartChart', link: 'https://www.smartchart.cn/echart/show/' }
    ],
    navbar: true,
    sidebar: {
      collapsable: false,
      '/guide/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: '可视化技术基础',
          collapsable: true,
          children: [
            'guide/scene',
            'guide/tech',
            'guide/canvas',
            'guide/svg',
            'guide/webgl',
            'guide/zrender',
            'guide/d3',
            'guide/three',
            'guide/highcharts',
            'guide/antv',
            'guide/echarts',
            'guide/echarts-basic',
            'guide/compare',
            'guide/bmap',
            'guide/bmap-harder',
            'guide/bmap-datav',
            'guide/bmap-webpack',
            'guide/echarts-map',
            'guide/amap',
            'guide/amap-harder',
            'guide/amap-datav',
          ]
        },
        {
          title: '数据大屏项目进阶',
          collapsable: true,
          children: [
            'screen/vue3',
            'screen/components',
            'screen/scrollList',
            'screen/echartsComplex',
            'screen/echartsOrderMap',
            'screen/echartsgl'
          ]
        },
        {
          title: '数据报表项目',
          collapsable: true,
          children: [
            'report/guide',
            'report/qa',
            'report/summary',
          ]
        },
        {
          title: '数据可视化组件库',
          collapsable: true,
          children: [
            'libs/start',
            'libs/svg',
            'libs/svgAnimation',
            'libs/svgComponent'
          ]
        },
        {
          title: '移动报表项目',
          collapsable: true,
          children: [
            'mobile/guide',
          ]
        }
      ]
    }
  }
}
