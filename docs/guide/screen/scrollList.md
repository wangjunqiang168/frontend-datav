# 基础组件

## 可滑动的列表

vue3版本

::: details
```html
<template>
  <div class="base-scroll-list" :id="id">
    <div
      class="base-scroll-list-header"
      :style="{
        backgroundColor: actualConfig.headerBg,
        height: `${actualConfig.headerHeight}px`,
        fontSize: `${actualConfig.headerFontSize}px`,
        color: actualConfig.headerColor,
      }"
    >
      <div
        class="header-item base-scroll-list-text"
        v-for="(headerItem, i) in headerData"
        :key="headerItem + i"
        :style="{
          width: `${columnWidths[i]}px`,
          ...headerStyle[i]
        }"
        v-html="headerItem"
        :align="aligns[i]"
      />
    </div>
    <div
      class="base-scroll-list-rows-wrapper"
      :style="{
        height: `${height - actualConfig.headerHeight}px`
      }"
    >
      <div
        class="base-scroll-list-rows"
        v-for="(rowData, index) in currentRowsData"
        :key="rowData.rowIndex"
        :style="{
        height: `${rowHeights[index]}px`,
        lineHeight: `${rowHeights[index]}px`,
        backgroundColor: rowData.rowIndex % 2 === 0 ? rowBg[1] : rowBg[0],
        fontSize: `${actualConfig.rowFontSize}px`,
        color: actualConfig.rowColor,
      }"
      >
        <div
          class="base-scroll-list-columns base-scroll-list-text"
          v-for="(colData, colIndex) in rowData.data"
          :key="colData + colIndex"
          :style="{
          width: `${columnWidths[colIndex]}px`,
          ...rowStyle[colIndex]
        }"
          v-html="colData"
          :align="aligns[colIndex]"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, ref, watch } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import useScreen from '../../hooks/useScreen'
  import cloneDeep from 'lodash/cloneDeep'
  import assign from 'lodash/assign'

  const defaultConfig = {
    // 标题数据，格式：['a','b','c']
    headerData: [],
    // 标题样式，格式：[{},{},{}]
    headerStyle: [],
    // 行样式
    rowStyle: [],
    // 行背景色
    rowBg: [],
    // 标题的背景色
    headerBg: 'rgb(90,90,90)',
    // 标题的高度
    headerHeight: 35,
    // 标题是否展示序号
    headerIndex: false,
    // 序号列标题的内容
    headerIndexContent: '#',
    // 序号列标题的样式
    headerIndexStyle: {
      width: '50px'
    },
    // 序号列的内容
    headerIndexData: [],
    // 序号列内容的样式
    rowIndexStyle: {
      width: '50px'
    },
    // 数据项，二维数组
    data: [],
    // 每页显示数据量
    rowNum: 10,
    // 居中方式
    aligns: [],
    headerFontSize: 28,
    rowFontSize: 28,
    headerColor: '#fff',
    rowColor: '#000',
    moveNum: 1, // 移动的位置
    duration: 2000 // 动画间隔
  }
  export default {
    name: 'BaseScrollList',
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const id = `base-scroll-list-${uuidv4()}`
      const { width, height } = useScreen(id)
      const actualConfig = ref([])
      const headerData = ref([])
      const headerStyle = ref([])
      const rowStyle = ref([])
      const columnWidths = ref([])
      const rowBg = ref([])
      const rowHeights = ref([])
      const rowsData = ref([])
      const currentRowsData = ref([]) //
      const currentIndex = ref(0) // 动画指针
      const rowNum = ref(defaultConfig.rowNum)
      const aligns = ref([])
      const isAnimationStop = ref(false)

      let avgHeight // 行高

      const handleHeader = (config) => {
        const _headerData = cloneDeep(config.headerData)
        const _headerStyle = cloneDeep(config.headerStyle)
        const _rowStyle = cloneDeep(config.rowStyle)
        const _rowsData = cloneDeep(config.data)
        const _aligns = cloneDeep(config.aligns)
        if (_headerData.length === 0) {
          return
        }
        if (config.headerIndex) {
          _headerData.unshift(config.headerIndexContent)
          _headerStyle.unshift(config.headerIndexStyle)
          _rowStyle.unshift(config.rowIndexStyle)
          _rowsData.forEach((rows, index) => {
            if (config.headerIndexData[index]) {
              rows.unshift(config.headerIndexData[index])
            } else {
              rows.unshift(index + 1)
            }
          })
          _aligns.unshift('center')
        }
        // 动态计算header中每一列的宽度
        let usedWidth = 0
        let usedColumnNum = 0
        // 判断是否自定义width
        _headerStyle.forEach(style => {
          // 如果自定义width，则按照自定义width进行渲染
          if (style.width) {
            usedWidth += +style.width.replace('px', '')
            usedColumnNum++
          }
        })
        // 动态计算列宽时，使用剩余的宽度除以剩余的列数
        const avgWidth = (width.value - usedWidth) / (_headerData.length - usedColumnNum)
        const _columnWidth = new Array(_headerData.length).fill(avgWidth)
        _headerStyle.forEach((style, index) => {
          // 如果自定义width，则按照自定义width进行渲染
          if (style.width) {
            const headerWidth = +style.width.replace('px', '')
            _columnWidth[index] = headerWidth
          }
        })

        columnWidths.value = _columnWidth
        headerData.value = _headerData
        headerStyle.value = _headerStyle
        rowStyle.value = _rowStyle

        const { rowNum } = config
        if (_rowsData.length >= rowNum && _rowsData.length < rowNum * 2) {
          const newRowData = [..._rowsData, ..._rowsData]
          rowsData.value = newRowData.map((item, index) => ({
            data: item,
            rowIndex: index
          }))
        } else {
          rowsData.value = _rowsData.map((item, index) => ({
            data: item,
            rowIndex: index
          }))
        }
        aligns.value = _aligns

        console.log(_aligns, aligns.value)
      }

      const handleRows = (config) => {
        // 动态计算每行数据的高度
        const { headerHeight } = config
        rowNum.value = config.rowNum
        const unusedHeight = height.value - headerHeight
        // 如果rowNum大于实际数据长度，则以实际数据长度为准
        if (rowNum.value > rowsData.value.length) {
          rowNum.value = rowsData.value.length
        }
        avgHeight = unusedHeight / rowNum.value
        rowHeights.value = new Array(rowNum.value).fill(avgHeight)

        // 获取行背景色
        if (config.rowBg) {
          rowBg.value = config.rowBg
        }
      }

      const startAnimation = async () => {
        const config = actualConfig.value
        const { rowNum, moveNum, duration } = config
        const totalLength = rowsData.value.length
        if (totalLength < rowNum) return
        const index = currentIndex.value
        const _rowsData = cloneDeep(rowsData.value)
        // 将数据重新头尾相连
        const rows = _rowsData.slice(index)
        rows.push(..._rowsData.slice(0, index))
        currentRowsData.value = rows
        // 先将所有行的高度还原
        rowHeights.value = new Array(totalLength).fill(avgHeight)
        const waitTime = 300
        if (isAnimationStop.value) {
          return
        }
        await new Promise(resolve => setTimeout(resolve, waitTime))
        // 将moveNum的行高度设置0
        rowHeights.value.splice(0, moveNum, ...new Array(moveNum).fill(0))
        currentIndex.value += moveNum
        // 是否到达最后一组数据
        const isLast = currentIndex.value - totalLength
        if (isLast >= 0) {
          currentIndex.value = isLast
        }
        if (isAnimationStop.value) {
          return
        }
        await new Promise(resolve => setTimeout(resolve, duration - waitTime))
        if (isAnimationStop.value) {
          return
        }
        await startAnimation()
      }

      const stopAnimation = () => {
        isAnimationStop.value = true
      }

      const update = () => {
        stopAnimation()
        const _actualConfig = assign(defaultConfig, props.config)
        // 赋值rowsData
        rowsData.value = _actualConfig.data || []
        handleHeader(_actualConfig)
        handleRows(_actualConfig)
        actualConfig.value = _actualConfig

        // 展示动画
        isAnimationStop.value = false
        startAnimation()
      }

      watch(() => props.config, () => {
        console.log('watch!', props.config)
        update()
      })

      return {
        id,
        headerData,
        headerStyle,
        rowStyle,
        aligns,
        columnWidths,
        rowHeights,
        rowsData,
        currentRowsData,
        rowBg,
        actualConfig,
        height
      }
    }
  }
</script>

<style lang="scss" scoped>
  .base-scroll-list {
    width: 100%;
    height: 100%;

    .base-scroll-list-text {
      padding: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }

    .base-scroll-list-header {
      display: flex;
      align-items: center;

      .header-item {
      }
    }

    .base-scroll-list-rows-wrapper {
      overflow: hidden;

      .base-scroll-list-rows {
        display: flex;
        align-items: center;
        transition: all 0.3s linear;

        .base-scroll-list-columns {
          height: 100%;
        }
      }
    }
  }
</style>
```
:::

测试

::: details
```html
<template>
  <div style="width: 500px;height: 400px;">
    <base-scroll-list
      :config="config"
    />
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    setup() {
      const config = ref({})
      const headerData = ['姓名', '年龄', '月薪']
      const headerStyle = [{ color: 'red' }, { width: '100px' }]
      const headerFontSize = 24
      const headerColor = '#fff'
      const rowFontSize = 20
      const rowColor = '#000'
      const rowStyle = [{ color: 'blue' }]
      const rowBg = ['rgb(200,200,200)', 'rgb(255,255,255)']
      const aligns = ['center', 'left', 'right']
      const data = []

      for (let i = 0; i < 10; i++) {
        data.push([
          '同学' + (i + 1),
          Math.floor(Math.random() * 10 + 20),
          Math.floor(Math.random() * 10000 + 10000)
        ])
      }

      config.value = {
        headerData,
        headerStyle,
        rowStyle,
        rowBg,
        headerBg: 'rgb(80,80,80)',
        headerHeight: '40',
        headerIndex: true,
        data,
        rowNum: 10,
        aligns,
        headerFontSize,
        rowFontSize,
        headerColor,
        rowColor
      }

      return {
        config
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
```
:::

数据

::: details
```js
/* eslint-disable-next-line */
const salesListMockData = [{"order":"北京 -10%","shop":"北京 -19%","rider":"北京 -12%","newShop":"北京 -17%","avgOrder":"北京 -8%"},{"order":"上海 +19%","shop":"上海 -7%","rider":"上海 +6%","newShop":"上海 +7%","avgOrder":"上海 +21%"},{"order":"广州 -6%","shop":"广州 -5%","rider":"广州 +23%","newShop":"广州 -22%","avgOrder":"广州 +12%"},{"order":"深圳 -19%","shop":"深圳 -14%","rider":"深圳 -13%","newShop":"深圳 +7%","avgOrder":"深圳 -7%"},{"order":"南京 -22%","shop":"南京 -7%","rider":"南京 -7%","newShop":"南京 +16%","avgOrder":"南京 -8%"},{"order":"杭州 +15%","shop":"杭州 +9%","rider":"杭州 -10%","newShop":"杭州 -11%","avgOrder":"杭州 +7%"},{"order":"合肥 -8%","shop":"合肥 -5%","rider":"合肥 +9%","newShop":"合肥 -7%","avgOrder":"合肥 -12%"},{"order":"济南 +20%","shop":"济南 +8%","rider":"济南 +16%","newShop":"济南 +3%","avgOrder":"济南 -12%"},{"order":"太原 +8%","shop":"太原 -4%","rider":"太原 +5%","newShop":"太原 +10%","avgOrder":"太原 +25%"},{"order":"成都 -7%","shop":"成都 +19%","rider":"成都 -24%","newShop":"成都 +13%","avgOrder":"成都 -3%"},{"order":"重庆 +4%","shop":"重庆 -24%","rider":"重庆 +12%","newShop":"重庆 +9%","avgOrder":"重庆 +4%"},{"order":"苏州 +16%","shop":"苏州 -8%","rider":"苏州 +19%","newShop":"苏州 -17%","avgOrder":"苏州 -15%"},{"order":"无锡 +15%","shop":"无锡 +12%","rider":"无锡 +20%","newShop":"无锡 -13%","avgOrder":"无锡 -20%"},{"order":"常州 -18%","shop":"常州 -19%","rider":"常州 +15%","newShop":"常州 +5%","avgOrder":"常州 +8%"},{"order":"温州 -21%","shop":"温州 +20%","rider":"温州 +8%","newShop":"温州 -21%","avgOrder":"温州 +11%"},{"order":"哈尔滨 -19%","shop":"哈尔滨 -17%","rider":"哈尔滨 -9%","newShop":"哈尔滨 -23%","avgOrder":"哈尔滨 +18%"},{"order":"长春 -2%","shop":"长春 +18%","rider":"长春 -20%","newShop":"长春 -4%","avgOrder":"长春 -24%"},{"order":"大连 +22%","shop":"大连 -15%","rider":"大连 -6%","newShop":"大连 -16%","avgOrder":"大连 +9%"},{"order":"沈阳 -15%","shop":"沈阳 -8%","rider":"沈阳 -17%","newShop":"沈阳 +14%","avgOrder":"沈阳 -14%"},{"order":"拉萨 -4%","shop":"拉萨 -17%","rider":"拉萨 -17%","newShop":"拉萨 +19%","avgOrder":"拉萨 -21%"},{"order":"呼和浩特 -10%","shop":"呼和浩特 +15%","rider":"呼和浩特 +17%","newShop":"呼和浩特 +21%","avgOrder":"呼和浩特 +11%"},{"order":"武汉 +15%","shop":"武汉 -12%","rider":"武汉 +18%","newShop":"武汉 +15%","avgOrder":"武汉 -7%"},{"order":"南宁 -17%","shop":"南宁 -13%","rider":"南宁 -23%","newShop":"南宁 -13%","avgOrder":"南宁 -14%"}]
```
:::

引用

::: details
```html
<template>
  <div class="sales-list">
    <div class="title">区域销售大盘环比分析</div>
    <div class="list">
      <base-scroll-list :config="config" />
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, watch } from 'vue'

  export default {
    name: 'SalesList',
    props: {
      data: Array
    },
    setup(props) {
      const config = ref({})

      const update = () => {
        const data = []
        const aligns = []
        const headerIndexData = []
        for (let i = 0; i < props.data.length; i++) {
          data[i] = []
          aligns[i] = 'center'
          if (i % 2 === 0) {
            headerIndexData[i] = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            <div style="width:15px;height:15px;background:rgb(72,122,72);border-radius:50%;border:1px solid #fff;"/>
          </div>`
          } else {
            headerIndexData[i] = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            <div style="width:15px;height:15px;background:rgb(38,88,104);border-radius:50%;border:1px solid #fff;"/>
          </div>`
          }
          for (let j = 0; j < 5; j++) {
            let text = ''
            switch (j) {
              case 0:
                text = props.data[i].order
                break
              case 1:
                text = props.data[i].shop
                break
              case 2:
                text = props.data[i].rider
                break
              case 3:
                text = props.data[i].newShop
                break
              case 4:
                text = props.data[i].avgOrder
                break
              default:
            }
            if (j === 1 || j === 3) {
              data[i].push(`<div style="color:rgb(178,209,126)">${text}</div>`)
            } else {
              data[i].push(`<div>${text}</div>`)
            }
          }
        }
        config.value = {
          headerData: ['城市订单量', '店铺数', '接单骑手人数', '新店铺数量', '人均订单量'], // 表头
          data, // 表格数据
          rowNum: 12, // 显示行数
          aligns, // 表格排序
          headerIndex: true, // 是否显示序号
          headerIndexContent: '', // 序号列表头文字
          headerIndexData, // 序号列内容
          headerBGC: 'rgb(80, 80, 80)', // 表头背景色
          headerHeight: 55, // 表头高度
          headerFontSize: 24, // 表头文字大小
          rowBg: ['rgb(40, 40, 40)', 'rgb(55, 55, 55)'], // 奇偶行背景色
          rowFontSize: 24, // 表格文字大小
          rowColor: '#fff'
        }
      }
      onMounted(() => {
        update()
      })
      const stop = watch(() => props.data, () => {
        update()
        stop()
      })
      return {
        config
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-list {
    width: 100%;
    height: 100%;
    background: rgb(55, 55, 55);
    padding: 20px 40px;
    box-sizing: border-box;

    .title {
      font-size: 36px;
      margin-left: 20px;
    }

    .list {
      width: 100%;
      height: 880px;
      font-size: 32px;
      margin-top: 20px;
      padding: 30px 0;
      box-sizing: border-box;
      background: rgb(40, 40, 40);
    }
  }
</style>
```
:::
