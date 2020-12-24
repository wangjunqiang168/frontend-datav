# 数据大屏组件开发

## 平均年龄组件

> 初始代码

### useScreenData.js
```js
/* eslint-disable-next-line */
const ageMockData = [{"startValue":0,"value":131107,"axis":"0-20","color":"rgb(116,166,49)"},{"startValue":0,"value":330831,"axis":"20-30","color":"rgb(190,245,99)"},{"startValue":0,"value":551238,"axis":"30-50","color":"rgb(202,252,137)"},{"startValue":0,"value":31088,"axis":">50","color":"rgb(251,253,142)"}]
```

### AverageAge/index.vue
::: details
```html
<template>
  <div class="average-age">
    <div class="title-wrapper">
      <div class="average-age-left">
        <div class="title">慕课外卖用户年龄分布&平均年龄</div>
        <div class="sub-title">Distribution of Age</div>
      </div>
      <div class="average-age-right">
        <div class="age">
          <count-to
            :start-val="startAge"
            :end-val="avgAge"
            :duration="1000"
            :decimals="2"
          />
          <span class="age-unit">岁</span>
        </div>
      </div>
    </div>
    <div id="average-age-chart" />
    <div class="average-data-wrapper">
      <div class="average-data" v-for="(item, index) in data" :key="index">
        <div class="average-data-value">
          <count-to
            :start-val="item.startValue"
            :end-val="item.value"
            :duration="1000"
          />
        </div>
        <div class="average-data-axis">
          <div class="point" :style="{background: item.color}" />
          <div class="text">{{item.axis}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'

  // const color = ['rgb(116,166,49)', 'rgb(190,245,99)', 'rgb(202,252,137)', 'rgb(251,253,142)']

  export default {
    name: 'averageAge',
    props: {
      data: Array,
      avgAge: Number
    },
    setup() {
      const startAge = ref(0)
      const update = () => {
      }

      return {
        startAge,
        update
      }
    }
  }
</script>

<style lang="scss" scoped>
  .average-age {
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);
    padding: 20px 40px;
    box-sizing: border-box;

    .title-wrapper {
      display: flex;
      align-items: center;

      .average-age-left {
        .title {
          font-size: 32px;
        }

        .sub-title {
          font-size: 16px;
          margin-top: 10px;
        }
      }

      .average-age-right {
        flex: 1;
        margin-left: 40px;
        font-weight: bold;

        .age {
          font-size: 68px;
          font-family: DIN;

          .age-unit {
            font-size: 20px;
          }
        }
      }
    }

    #average-age-chart {
      height: 120px;
    }

    .average-data-wrapper {
      display: flex;

      .average-data {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        font-weight: bolder;

        .average-data-value {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .average-data-axis {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 5px;

          .point {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }

          .text {
            margin-left: 10px;
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
```
:::

## 设备统计组件

### useScreenData.js

```js
/* eslint-disable-next-line */
const deviceMockData = {"totalDevices":1070909,"devices":[{"key":"Android","value":423676},{"key":"iOS","value":373581},{"key":"PC","value":273652}]}
```

### TotalDevice/index.vue

::: details
```html
<template>
  <div class="total-device">
    <div class="total-device-left">
      <div id="total-device-chart" />
    </div>
    <div class="total-device-right">
      <div class="title-wrapper">
        <div class="total-device-right-left">
          <div class="title">慕课外卖登录设备</div>
          <div class="sub-title">Distribution of Internet devices</div>
        </div>
        <div class="total-device-right-right">
          <div class="age">
            <count-to
              :startVal="startNum"
              :endVal="num"
              :duration="1000"
            />
            <span class="age-unit">台</span>
          </div>
        </div>
      </div>
      <div class="average-data-wrapper">
        <div class="average-data" v-for="(item, index) in refData" :key="index">
          <div class="average-data-value">
            <count-to
              :startVal="item.startValue"
              :endVal="item.value"
              :duration="1000"
            />
          </div>
          <div class="average-data-axis">
            <div class="point" :style="{background: item.color}" />
            <div class="text">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import { ref, watch, onMounted } from 'vue'

  const color = ['rgb(176,207,120)', 'rgb(157,195,91)', 'rgb(131,167,72)']

  export default {
    name: 'totalDevice',
    props: {
      data: Object
    },
    setup(props) {
      let chart
      const refData = ref([])
      const num = ref(0)
      const startNum = ref(0)
      const updateChart = () => {
        function createOption() {
          return {
            series: [{
              name: '访问来源',
              type: 'pie',
              radius: '70%',
              selectedMode: 'multiple',
              selectedOffset: 10,
              clockwise: true,
              center: ['50%', '50%'],
              color,
              emphasis: {
                itemStyle: {
                  color: 'rgb(140,251,182)'
                }
              },
              data: refData.value,
              roseType: 'radius',
              label: { show: false }
            }]
          }
        }

        if (!chart) {
          chart = Echarts.init(document.getElementById('total-device-chart'))
        }
        chart.setOption(createOption())
      }
      const update = (newData) => {
        if (refData.value.length > 0) {
          refData.value = newData.devices.map((item, index) => ({
            startValue: refData.value[index].value,
            value: item.value,
            name: item.key,
            color: color[index]
          }))
        } else {
          refData.value = newData.devices.map((item, index) => ({
            startValue: 0,
            value: item.value,
            name: item.key,
            color: color[index]
          }))
        }
        startNum.value = num.value
        num.value = +newData.totalDevices
        updateChart()
      }
      watch(() => props.data, (newData) => {
        update(newData)
      })
      onMounted(() => {
        update(props.data)
      })
      return {
        refData,
        num,
        startNum
      }
    }
  }
</script>

<style lang="scss" scoped>
  .total-device {
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);

    .total-device-left {
      width: 30%;
      height: 100%;

      #total-device-chart {
        width: 100%;
        height: 100%;
      }
    }

    .total-device-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 10px 40px 0;

      .title-wrapper {
        display: flex;
        align-items: center;

        .total-device-right-left {
          .title {
            font-size: 32px;
          }

          .sub-title {
            font-size: 16px;
            margin-top: 10px;
          }
        }

        .total-device-right-right {
          flex: 1;
          margin-left: 40px;
          font-weight: bold;

          .age {
            font-size: 56px;
            font-family: DIN;

            .age-unit {
              font-size: 20px;
            }
          }
        }
      }

      .average-data-wrapper {
        display: flex;

        .average-data {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: bolder;

          .average-data-value {
            width: 100%;
          }

          .average-data-axis {
            display: flex;
            align-items: center;
            width: 100%;
            margin-top: 5px;

            .point {
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }

            .text {
              margin-left: 10px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
```
:::

## 性别统计组件

### useScreenData.js

```js
/* eslint-disable-next-line */
const genderMockData = [{"key":"male","value":1442542},{"key":"female","value":1442548}]
```

### TotalGender/index.vue

::: details
```html
<template>
  <div class="total-gender">
    <div class="total-gender-wrapper">
      <div class="total-gender-left">
        <img src="https://www.youbaobao.xyz/datav-res/datav/datav_circle.png">
      </div>
      <div class="total-gender-right">
        <div class="title">男性用户人数</div>
        <div class="sub-title">Number of male users</div>
        <div class="age">
          <count-to
            :startVal="startMale"
            :endVal="endMale"
            :duration="1000"
          />
          <span class="age-unit">万人</span>
        </div>
      </div>
    </div>
    <div class="total-gender-wrapper">
      <div class="total-gender-left">
        <img src="https://www.youbaobao.xyz/datav-res/datav/datav_circle.png">
      </div>
      <div class="total-gender-right">
        <div class="title">女性用户人数</div>
        <div class="sub-title">Number of female users</div>
        <div class="age">
          <count-to
            :startVal="startFemale"
            :endVal="endFemale"
            :duration="1000"
          />
          <span class="age-unit">万人</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, watch } from 'vue'

  export default {
    name: 'totalGender',
    props: {
      data: Array
    },
    setup(props) {
      const startMale = ref(0)
      const endMale = ref(0)
      const startFemale = ref(0)
      const endFemale = ref(0)
      watch(() => props.data, (newData) => {
        startMale.value = endMale.value
        endMale.value = newData[0].value
        startFemale.value = endFemale.value
        endFemale.value = newData[1].value
      })
      return {
        startFemale,
        startMale,
        endFemale,
        endMale
      }
    }
  }
</script>

<style lang="scss" scoped>
  .total-gender {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);
    box-sizing: border-box;

    .total-gender-wrapper {
      display: flex;

      .total-gender-left {
        img {
          width: 75px;
          height: 75px;
        }
      }

      .total-gender-right {
        margin-left: 40px;

        .title {
          font-size: 32px;
        }

        .sub-title {
          font-size: 16px;
          margin-top: 10px;
        }

        .age {
          font-size: 49px;
          font-family: DIN;
          font-weight: bold;
          margin-top: 10px;

          .age-unit {
            font-size: 20px;
          }
        }
      }
    }
  }
</style>
```
:::

## 骑手统计组件

### useScreenData.js

```js
/* eslint-disable-next-line */
const riderMockData = {"axisX":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"orderData":{"legend1":"去年骑手月人均接单","legend2":"今年骑手月人均接单","data1":["330","420","560","450","610","890","720","610","580","750","770","600"],"data2":["430","510","660","550","710","990","620","550","760","810","930","720"]},"rateData":{"legend1":"去年月新增骑手","legend2":"今年月新增骑手","data1":["129","223","202","197","300","112","333","249","178","322","401","167"],"data2":["179","263","282","297","330","344","222","299","190","455","566","233"]}}
```

### TotalRider/index.vue

::: details
```html
<template>
  <div class="line-chart">
    <div class="title-wrapper">
      <div class="title">慕课外卖骑手概况</div>
      <div class="sub-title">Rider Growth rate</div>
    </div>
    <div id="average-age-chart2" />
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import { watch, onMounted, onUnmounted } from 'vue'

  const colors = ['rgb(209,248,139)', 'rgb(115,201,245)', 'rgb(124,136,146)']

  export default {
    name: 'TotalRider',
    props: {
      data: Object
    },
    setup(props) {
      let chart
      let task
      let currentChart = 0

      const update = () => {
        function createOption() {
          const { axisX, orderData, rateData } = props.data
          const axisData = axisX
          let legendData = []
          let data1 = []
          let data2 = []
          if (currentChart === 0) {
            legendData = [orderData.legend1, orderData.legend2]
            data1 = orderData.data1
            data2 = orderData.data2
          } else {
            legendData = [rateData.legend1, rateData.legend2]
            data1 = rateData.data1
            data2 = rateData.data2
          }
          return {
            color: colors,
            tooltip: {
              trigger: 'none',
              axisPointer: {
                type: 'cross'
              }
            },
            legend: {
              top: 20,
              right: 40,
              icon: 'rect',
              textStyle: {
                fontSize: 16,
                color: colors[2]
              },
              data: legendData
            },
            grid: {
              top: 60,
              bottom: 30,
              left: 80,
              right: 40
            },
            xAxis: [{
              type: 'category',
              axisTick: { show: false },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                fontSize: 16
              },
              data: axisData
            }, {
              type: 'category',
              axisTick: { show: false },
              axisLine: { show: false }
            }],
            yAxis: [{
              type: 'value',
              axisTick: { show: false },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                fontSize: 16
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              }
            }],
            series: [{
              name: legendData[0],
              type: 'line',
              xAxisIndex: 1,
              smooth: true,
              lineStyle: {
                width: 2
              },
              symbol: 'none',
              // data: [5, 100, 70, 120, 80, 15, 200, 300, 195, 150, 80, 103]
              data: data1
            }, {
              name: legendData[1],
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 2
              },
              symbol: 'none',
              // data: [10, 50, 80, 4, 90, 50, 105, 160, 111, 54, 108, 50]
              data: data2
            }]
          }
        }

        if (!chart) {
          chart = Echarts.init(document.getElementById('average-age-chart2'))
        }
        chart.setOption(createOption())
        if (currentChart === 0) {
          currentChart = 1
        } else {
          currentChart = 0
        }
      }
      const stop = watch(() => props.data, () => {
        update()
        task = setInterval(() => {
          update()
        }, 5000)
        stop()
      })
      onMounted(() => {
        update()
      })
      onUnmounted(() => task && clearInterval(task))
    }
  }
</script>

<style lang="scss" scoped>
  .line-chart {
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);

    .title-wrapper {
      padding: 20px 40px 0;
      box-sizing: border-box;

      .title {
        font-size: 32px;
      }

      .sub-title {
        font-size: 16px;
        margin-top: 10px;
      }
    }

    #average-age-chart2 {
      width: 100%;
      height: 250px;
    }
  }
</style>
```
:::

## 热门分类组件

### useScreenData.js

```js
/* eslint-disable-next-line */
const hotCategoryMockData = {"data1":{"axisX":["粉面粥店","简餐便当","汉堡披萨","香锅冒菜","小吃炸串","地方菜系","轻食简餐"],"data1":[50,29,46,88,99,69,97],"data2":[50,71,54,12,1,31,3]},"data2":{"axisX":["草莓","甘蔗","榴莲","菠萝","香蕉","梨","苹果"],"data1":[85,4,3,26,63,31,19],"data2":[15,96,97,74,37,69,81]}}
```

### HotCategory/index.vue

::: details
```html
<template>
  <div class="bar-chart">
    <div class="title-wrapper">
      <div class="left">
        <div class="title">当前热卖品类</div>
        <div class="sub-title">Hot Categories</div>
      </div>
      <div class="right">
        <div class="sub-title">最后更新时间：{{date}} {{time}}</div>
      </div>
    </div>
    <div id="average-age-chart3" />
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import { watch, onMounted } from 'vue'
  import { clock as useClock } from '../../utils/clock'

  export default {
    name: 'HotCategory',
    props: {
      data: Object
    },
    setup(props) {
      const { time, date } = useClock()
      let chart
      let currentChart = 0
      const update = () => {
        function createOption() {
          const sourceData = []
          const { data1, data2 } = props.data
          if (currentChart === 0) {
            data1.axisX.forEach((axis, index) => {
              sourceData.push([axis, data1.data1[index], data1.data2[index]])
            })
          } else {
            data2.axisX.forEach((axis, index) => {
              sourceData.push([axis, data2.data1[index], data2.data2[index]])
            })
          }
          const source = [
            ['指标', '国内', '海外'],
            ...sourceData
          ]
          return {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            color: ['rgb(209,248,138)', 'rgba(65,65,65,.5)'],
            grid: {
              left: 20,
              right: 0,
              bottom: 30,
              top: 20
            },
            dataset: {
              source
            },
            yAxis: {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dotted'
                }
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: 'rgb(124,136,146)'
                }
              },
              axisLabel: {
                color: 'rgb(98,105,113)',
                fontSize: 16
              },
              axisTick: { show: false }
            },
            xAxis: {
              type: 'category',
              splitLine: { show: false },
              axisTick: { show: false },
              axisLabel: {
                color: 'rgb(98,105,113)',
                fontSize: 16
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: 'rgb(124,136,146)'
                }
              }
            },
            series: [
              {
                type: 'bar',
                stack: 'total',
                barWidth: 40
              },
              {
                type: 'bar',
                stack: 'total'
              }
            ]
          }
        }
        if (!chart) {
          chart = Echarts.init(document.getElementById('average-age-chart3'))
        }
        chart.setOption(createOption())
        currentChart === 0 ? currentChart = 1 : currentChart = 0
      }
      watch(() => props.data, () => {
        update()
      })
      onMounted(() => {
        update()
      })
      return {
        time,
        date
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bar-chart {
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);
    padding: 20px 40px;
    box-sizing: border-box;

    .title-wrapper {
      display: flex;

      .right {
        flex: 1;
        text-align: right;
      }

      .title {
        font-size: 32px;
      }

      .sub-title {
        font-size: 16px;
        margin-top: 10px;
      }
    }

    #average-age-chart3 {
      height: 220px;
    }
  }
</style>
```
:::

### 顶部组件

### useScreenData.js

```js
/* eslint-disable-next-line */
const headerMockData = {"headerData":{"value":[{"title":"今日销售额","subTitle":"Today's Sales Amount","startVal":40041113,"endVal":40105335,"img":"https://www.youbaobao.xyz/datav-res/money.png"},{"title":"今日订单量","subTitle":"Today's Total Orders","startVal":2566778,"endVal":2570025,"img":"https://www.youbaobao.xyz/datav-res/order.png"},{"title":"今日交易用户数","subTitle":"Today's Payed Users","startVal":271744,"endVal":272200,"img":"https://www.youbaobao.xyz/datav-res/member.png"},{"title":"今日新增用户数","subTitle":"Today's New Users","startVal":1286552,"endVal":1289057,"img":"https://www.youbaobao.xyz/datav-res/follow.png"}]},"project":{"value":[{"title":"转化率","value":"13.16%","img":"https://www.youbaobao.xyz/datav-res/success.png"},{"title":"退单率","value":"5.73%","img":"https://www.youbaobao.xyz/datav-res/failed.png"}]}}
```

### CenterHeader/index.vue

::: details
```html
<template>
  <div class="center-header">
    <div class="center-header-wrapper">
      <div
        class="center-header-item"
        v-for="(item, index) in headerData"
        :key="index"
      >
        <div class="center-header-left">
          <div class="bg">
            <div
              class="img"
              :style="{backgroundImage: `url('${item.img}')`}"
            />
          </div>
        </div>
        <div class="center-header-right">
          <div class="title">{{item.title}}</div>
          <div class="sub-title">{{item.subTitle}}</div>
          <div class="total">
            <count-to
              :start-val="item.startVal"
              :end-val="item.endVal"
              :duration="1000"
              separator=","
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
    <div class="project-wrapper">
      <div class="project" v-for="(item, index) in project" :key="index">
        <div class="project-img">
          <img :src="item.img">
        </div>
        <div class="project-text">{{item.title}}</div>
        <div class="project-value">{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, watch, onMounted } from 'vue'

  export default {
    name: 'centerHeader',
    props: {
      data: Object
    },
    setup(props) {
      const project = ref([])
      const headerData = ref([])
      const update = () => {
        project.value = [...props.data.project.value]
        headerData.value = [...props.data.headerData.value]
      }
      onMounted(() => {
        update()
      })
      watch(() => props.data, () => {
        update()
      })
      return {
        project,
        headerData
      }
    }
  }
</script>

<style lang="scss" scoped>
  .center-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgb(66, 68, 70);
    padding: 0 40px;
    box-sizing: border-box;

    .center-header-wrapper {
      display: flex;

      .center-header-item {
        flex: 1;
        display: flex;

        .center-header-left {
          .bg {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 185px;
            height: 185px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-color: rgb(131, 167, 72);
            border-radius: 50%;

            .img {
              width: 60%;
              height: 60%;
              border-radius: 50%;
              background-repeat: no-repeat;
              background-size: 100% 100%;
            }
          }
        }

        .center-header-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 40px;
          width: 410px;

          .title {
            font-size: 32px;
          }

          .sub-title {
            font-size: 16px;
            letter-spacing: 1px;
            margin-top: 10px;
          }

          .total {
            font-family: DIN;
            font-size: 56px;
            font-weight: bolder;
            letter-spacing: 2px;
            margin-top: 10px;
          }
        }
      }
    }

    .project-wrapper {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .project {
        display: flex;
        flex-direction: column;
        align-items: center;

        .project-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 90px;
        }

        img {
          width: 100%;
          height: 100%;
        }

        .project-text {
          font-size: 18px;
          margin-top: 10px;
        }

        .project-value {
          font-size: 28px;
          font-weight: 700;
          margin-top: 5px;
        }
      }
    }
  }
</style>
```
:::

## 变换的分类组件

TransformCategory/index.vue

::: details
```html
<template>
  <div class="country-category">
    <div
      class="category"
      v-for="(item) in data" :key="item"
    >
      <div>{{item}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TransformCategory',
    props: {
      data: Array,
      color: {
        type: Array,
        default() {
          return ['rgb(140, 160, 173)', 'rgb(80, 80, 80)']
        }
      }
    },
    setup(props) {
    }
  }
</script>

<style lang="scss" scoped>
  .country-category {
    display: flex;
    width: 100%;
    height: 100%;

    .category {
      flex: 1;
      background: rgb(53, 57, 65);
      font-size: 24px;
      color: rgb(144, 160, 174);

      .hovered {
        background: rgb(80, 80, 80);
      }

      .selected {
        background: rgb(140, 160, 173);
        color: #fff;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
```
:::

::: tip
关于鼠标事件 mouseover 和 mouseenter、mouseout 和 mouseleave 的区别可[参考](https://www.jianshu.com/p/2f9c3c765459)
:::

## 实时订单组件

### 数据

::: details
```js
/* eslint-disable-next-line */
const realTimeOrderMockData = {"date":["12:25:13","12:25:17","12:25:22","12:25:27","12:25:32","12:25:37","12:25:42","12:25:47","12:25:52","12:25:57"],"data":[1143,769,251,733,335,969,869,1390,168,1391]}
```
:::

### 组件

::: details
```html
<template>
  <div class="real-time-order">
    <div class="real-time-order-left">
      <div class="title">实时订单趋势图</div>
      <div class="sub-title">Number Of Real-time Orders</div>
      <div class="total">
        <count-to
          :start-val="startVal"
          :end-val="endVal"
          :duration="1000"
          separator=","
          autoplay
        />
      </div>
      <div class="tiny-title">周同比增长率</div>
      <div class="percent-text">
        <span class="percent-text-1">
          <count-to
            :start-val="startPercent"
            :end-val="percent"
            :duration="1000"
            :decimals="2"
            suffix="%"
          />
        </span>
      </div>
    </div>
    <div class="real-time-order-right">
      <div id="real-time-order-chart" />
    </div>
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import { watch, onMounted } from 'vue'

  const kpi = 999999

  export default {
    name: 'RealTimeOrder',
    props: {
      data: Object
    },
    setup(props) {
      const update = () => {
        function createOption() {
          const option = {
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: props.data.date,
              axisLine: {
                lineStyle: {
                  color: 'rgba(200, 200, 200)'
                }
              },
              axisLabel: {
                fontSize: 16
              }
            },
            yAxis: {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: 'rgb(50, 50, 50)'
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(200, 200, 200)'
                }
              },
              axisLabel: {
                fontSize: 16
              }
            },
            dataZoom: [{
              type: 'inside',
              start: 0,
              end: 100
            }, {
              start: 0,
              end: 100,
              handleIcon: 'M 0.0525 0.5656 L 0.0525 0 L -0.0583 0 L -0.0583 0.5656 L -0.2449 0.5656 L -0.2449 1.4344 L -0.0525 1.4344 L -0.0525 2 L 0.0525 2 L 0.0525 1.4344 L 0.2449 1.4344 L 0.2449 0.5656 L 0.0525 0.5656 Z M 0.1399 1.1953 L -0.1458 1.1953 L -0.1458 1.1137 L 0.1399 1.1137 L 0.1399 1.1953 Z M 0.1399 0.8863 L -0.1458 0.8863 L -0.1458 0.8047 L 0.1399 0.8047 L 0.1399 0.8863 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#a7b7cc'
              },
              textStyle: {
                color: 'rgb(200, 200, 200)'
              },
              fillerColor: 'rgba(120,126,134,.3)',
              dataBackground: {
                lineStyle: {
                  color: 'grey'
                },
                areaStyle: {
                  color: 'gray'
                }
              },
              borderColor: 'rgb(200, 200, 200)'
            }],
            series: [
              {
                name: '模拟数据',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                  color: new Echarts.graphic.LinearGradient(0, 0, 0, 1,
                    [
                      {
                        offset: 0,
                        color: '#C2C90B'
                      },
                      {
                        offset: 0.5,
                        color: '#A1DC14'
                      },
                      {
                        offset: 1,
                        color: 'rgb(188, 222, 129)'
                      }
                    ])
                },
                data: props.data.data
              }
            ],
            grid: {
              top: 40,
              bottom: 80,
              right: 40,
              left: 80
            }
          }
          return option
        }

        const chart = Echarts.init(document.getElementById('real-time-order-chart'))
        chart.setOption(createOption())
      }
      onMounted(update)
      watch(() => props.data, () => {
        update()
      })
    },
    data() {
      return {
        startVal: 0,
        endVal: 23242,
        startPercent: 0,
        percent: 23242 / kpi * 100
      }
    }
  }
</script>

<style lang="scss" scoped>
  .real-time-order {
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(28,28,28);

    .real-time-order-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex: 0 0 320px;
      width: 320px;
      padding-left: 40px;
      box-sizing: border-box;

      .title {
        font-size: 32px;
      }

      .sub-title {
        font-size: 16px;
        letter-spacing: 1px;
        margin-top: 10px;
      }

      .total {
        font-family: DIN;
        font-size: 68px;
        font-weight: bolder;
        letter-spacing: 2px;
        padding: 10px 0;
      }

      .tiny-title {
        font-size: 18px;
        color: #fff;
        line-height: 36px;
      }

      .percent-text {
        font-size: 28px;
        font-family: DIN;
        letter-spacing: 2px;

        .percent-text-1 {
          color: rgb(197, 251, 121);
          font-weight: bolder;
        }
      }
    }

    .real-time-order-right {
      flex: 1;

      #real-time-order-chart {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
```
:::

## 销售日历组件

### 数据

::: details
```js
/* eslint-disable-next-line */
const scheduleViewMockData = [["2020-06-01",4675],["2020-06-02",5995],["2020-06-03",4512],["2020-06-04",6330],["2020-06-05",7413],["2020-06-06",6479],["2020-06-07",9587],["2020-06-08",3067],["2020-06-09",9545],["2020-06-10",9844],["2020-06-11",2403],["2020-06-12",2821],["2020-06-13",8965],["2020-06-14",9854],["2020-06-15",1401],["2020-06-16",5843],["2020-06-17",2541],["2020-06-18",9714],["2020-06-19",5311],["2020-06-20",3737],["2020-06-21",8718],["2020-06-22",3064],["2020-06-23",2620],["2020-06-24",7911],["2020-06-25",1853],["2020-06-26",7313],["2020-06-27",7940],["2020-06-28",7343],["2020-06-29",3490],["2020-06-30",6344],["2020-07-01",7193],["2020-07-02",2191],["2020-07-03",8001],["2020-07-04",4199],["2020-07-05",6274],["2020-07-06",6611],["2020-07-07",5805],["2020-07-08",7443],["2020-07-09",4685],["2020-07-10",271],["2020-07-11",1063],["2020-07-12",2309],["2020-07-13",7540],["2020-07-14",8076],["2020-07-15",5224],["2020-07-16",7393],["2020-07-17",5037],["2020-07-18",6534],["2020-07-19",2380],["2020-07-20",5379],["2020-07-21",5617],["2020-07-22",8635],["2020-07-23",1971],["2020-07-24",5302],["2020-07-25",1326],["2020-07-26",8064],["2020-07-27",4602],["2020-07-28",1423],["2020-07-29",4563],["2020-07-30",4497],["2020-07-31",2878],["2020-08-01",8509],["2020-08-02",2493],["2020-08-03",1101],["2020-08-04",7199],["2020-08-05",240],["2020-08-06",7451],["2020-08-07",7159],["2020-08-08",7950],["2020-08-09",5307],["2020-08-10",3520],["2020-08-11",9705],["2020-08-12",6444],["2020-08-13",6316],["2020-08-14",7540],["2020-08-15",9523],["2020-08-16",1758],["2020-08-17",9091],["2020-08-18",2014],["2020-08-19",6916],["2020-08-20",122],["2020-08-21",885],["2020-08-22",8100],["2020-08-23",5400],["2020-08-24",8554],["2020-08-25",5972],["2020-08-26",4689],["2020-08-27",4271],["2020-08-28",4974],["2020-08-29",3168],["2020-08-30",5051],["2020-08-31",6776],["2020-09-01",2170],["2020-09-02",7096],["2020-09-03",7237],["2020-09-04",6391],["2020-09-05",7341],["2020-09-06",571],["2020-09-07",9871],["2020-09-08",3671],["2020-09-09",6614],["2020-09-10",7740],["2020-09-11",6643],["2020-09-12",5989],["2020-09-13",1418],["2020-09-14",1748],["2020-09-15",4108],["2020-09-16",2265],["2020-09-17",4180],["2020-09-18",7724],["2020-09-19",6025],["2020-09-20",5766],["2020-09-21",1681],["2020-09-22",1396],["2020-09-23",3584],["2020-09-24",2719],["2020-09-25",5297],["2020-09-26",3857],["2020-09-27",7383],["2020-09-28",3538],["2020-09-29",9479],["2020-09-30",1692],["2020-10-01",5735],["2020-10-02",7365],["2020-10-03",9143],["2020-10-04",487],["2020-10-05",5500],["2020-10-06",7280],["2020-10-07",1458],["2020-10-08",8977],["2020-10-09",3233],["2020-10-10",7977],["2020-10-11",6756],["2020-10-12",324],["2020-10-13",5593],["2020-10-14",8510],["2020-10-15",5008],["2020-10-16",4647],["2020-10-17",3025],["2020-10-18",4639],["2020-10-19",8003],["2020-10-20",7950],["2020-10-21",8644],["2020-10-22",7363],["2020-10-23",4233],["2020-10-24",2521],["2020-10-25",1105],["2020-10-26",5371],["2020-10-27",4070],["2020-10-28",2871],["2020-10-29",1359],["2020-10-30",9214],["2020-10-31",2543],["2020-11-01",379],["2020-11-02",5603],["2020-11-03",6103],["2020-11-04",1960],["2020-11-05",4270],["2020-11-06",8334],["2020-11-07",1736],["2020-11-08",2521],["2020-11-09",659],["2020-11-10",764],["2020-11-11",4477],["2020-11-12",3316],["2020-11-13",742],["2020-11-14",6669],["2020-11-15",9450],["2020-11-16",661],["2020-11-17",9399],["2020-11-18",8387],["2020-11-19",2640],["2020-11-20",836],["2020-11-21",1466],["2020-11-22",8699],["2020-11-23",2476],["2020-11-24",3257],["2020-11-25",1798],["2020-11-26",6798],["2020-11-27",1019],["2020-11-28",8502],["2020-11-29",1676],["2020-11-30",7334],["2020-12-01",2989],["2020-12-02",6146],["2020-12-03",5916],["2020-12-04",442],["2020-12-05",7646],["2020-12-06",1435],["2020-12-07",6784],["2020-12-08",5759],["2020-12-09",9143],["2020-12-10",2412],["2020-12-11",4189],["2020-12-12",9402],["2020-12-13",837],["2020-12-14",7306],["2020-12-15",3071],["2020-12-16",729],["2020-12-17",118],["2020-12-18",4316],["2020-12-19",3788],["2020-12-20",82],["2020-12-21",5529],["2020-12-22",1790],["2020-12-23",4514],["2020-12-24",4872],["2020-12-25",7528],["2020-12-26",3090],["2020-12-27",9032],["2020-12-28",5572],["2020-12-29",2369],["2020-12-30",5025],["2020-12-31",3686],["2021-01-01",2362],["2021-01-02",8420],["2021-01-03",4266],["2021-01-04",8550],["2021-01-05",1175],["2021-01-06",768],["2021-01-07",6629],["2021-01-08",6663],["2021-01-09",2705],["2021-01-10",3248],["2021-01-11",742],["2021-01-12",3416],["2021-01-13",5140],["2021-01-14",9731],["2021-01-15",8571],["2021-01-16",5400],["2021-01-17",2649],["2021-01-18",4157],["2021-01-19",6995],["2021-01-20",1950],["2021-01-21",9251],["2021-01-22",3902],["2021-01-23",8742],["2021-01-24",5719],["2021-01-25",9489],["2021-01-26",1698],["2021-01-27",2436],["2021-01-28",7237],["2021-01-29",5844],["2021-01-30",1614],["2021-01-31",4938],["2021-02-01",3305],["2021-02-02",6115],["2021-02-03",4668],["2021-02-04",1850],["2021-02-05",6024],["2021-02-06",7048],["2021-02-07",1972],["2021-02-08",4273],["2021-02-09",3994],["2021-02-10",3665],["2021-02-11",654],["2021-02-12",2246],["2021-02-13",4731],["2021-02-14",114],["2021-02-15",4856],["2021-02-16",6945],["2021-02-17",3300],["2021-02-18",2816],["2021-02-19",941],["2021-02-20",1438],["2021-02-21",7506],["2021-02-22",416],["2021-02-23",6710],["2021-02-24",1278],["2021-02-25",3618],["2021-02-26",8608],["2021-02-27",1022],["2021-02-28",3127],["2021-03-01",9735],["2021-03-02",4085],["2021-03-03",620],["2021-03-04",7513],["2021-03-05",4887],["2021-03-06",4486],["2021-03-07",1426],["2021-03-08",9003],["2021-03-09",2350],["2021-03-10",6966],["2021-03-11",8957],["2021-03-12",3913],["2021-03-13",9120],["2021-03-14",8021],["2021-03-15",9948],["2021-03-16",1214],["2021-03-17",7500],["2021-03-18",4670],["2021-03-19",1335],["2021-03-20",2218],["2021-03-21",4865],["2021-03-22",2003],["2021-03-23",627],["2021-03-24",2495],["2021-03-25",6447],["2021-03-26",1989],["2021-03-27",609],["2021-03-28",1640],["2021-03-29",6562],["2021-03-30",1822],["2021-03-31",6979],["2021-04-01",3348],["2021-04-02",3489],["2021-04-03",7470],["2021-04-04",9468],["2021-04-05",2942],["2021-04-06",7284],["2021-04-07",190],["2021-04-08",2743],["2021-04-09",3543],["2021-04-10",9508],["2021-04-11",6833],["2021-04-12",7790],["2021-04-13",1763],["2021-04-14",2373],["2021-04-15",8991],["2021-04-16",41],["2021-04-17",4684],["2021-04-18",3],["2021-04-19",9739],["2021-04-20",4756],["2021-04-21",2619],["2021-04-22",590],["2021-04-23",9425],["2021-04-24",2216],["2021-04-25",398],["2021-04-26",4287],["2021-04-27",1455],["2021-04-28",3267],["2021-04-29",5365],["2021-04-30",7214],["2021-05-01",1284],["2021-05-02",4097],["2021-05-03",9282],["2021-05-04",4469],["2021-05-05",3658],["2021-05-06",8539],["2021-05-07",5810],["2021-05-08",6396],["2021-05-09",1542],["2021-05-10",6401],["2021-05-11",9424],["2021-05-12",3221],["2021-05-13",8868],["2021-05-14",5790],["2021-05-15",1145],["2021-05-16",8315],["2021-05-17",2146],["2021-05-18",3611],["2021-05-19",5768],["2021-05-20",9340],["2021-05-21",2347],["2021-05-22",1430],["2021-05-23",560],["2021-05-24",6380],["2021-05-25",9966],["2021-05-26",455],["2021-05-27",5885],["2021-05-28",6062],["2021-05-29",3801],["2021-05-30",6588],["2021-05-31",6709],["2021-06-01",7504],["2021-06-02",4697],["2021-06-03",9501],["2021-06-04",619],["2021-06-05",1865],["2021-06-06",1061],["2021-06-07",5142],["2021-06-08",424],["2021-06-09",2965],["2021-06-10",1828],["2021-06-11",6951],["2021-06-12",6115],["2021-06-13",1237],["2021-06-14",2501],["2021-06-15",5319],["2021-06-16",4055],["2021-06-17",8720],["2021-06-18",1274],["2021-06-19",9333],["2021-06-20",1903],["2021-06-21",5316],["2021-06-22",8036],["2021-06-23",6522],["2021-06-24",5697],["2021-06-25",1370],["2021-06-26",3998],["2021-06-27",6744],["2021-06-28",5423],["2021-06-29",5561],["2021-06-30",3013],["2021-07-01",5841],["2021-07-02",6117],["2021-07-03",6822],["2021-07-04",9332],["2021-07-05",444],["2021-07-06",2614],["2021-07-07",4762],["2021-07-08",7545],["2021-07-09",6139],["2021-07-10",4806],["2021-07-11",5185],["2021-07-12",636],["2021-07-13",3519],["2021-07-14",6921],["2021-07-15",9218],["2021-07-16",2002],["2021-07-17",324],["2021-07-18",1531],["2021-07-19",4746],["2021-07-20",8589],["2021-07-21",7578],["2021-07-22",4754],["2021-07-23",3023],["2021-07-24",5694],["2021-07-25",4889],["2021-07-26",6229],["2021-07-27",7400],["2021-07-28",1376],["2021-07-29",1639],["2021-07-30",2226],["2021-07-31",4169],["2021-08-01",6616],["2021-08-02",6811],["2021-08-03",7151],["2021-08-04",8862],["2021-08-05",1564],["2021-08-06",284],["2021-08-07",5509],["2021-08-08",7565],["2021-08-09",9220],["2021-08-10",969],["2021-08-11",8429],["2021-08-12",9598],["2021-08-13",1075],["2021-08-14",1373],["2021-08-15",5522],["2021-08-16",7217],["2021-08-17",6406],["2021-08-18",3473],["2021-08-19",7968],["2021-08-20",3988],["2021-08-21",1212],["2021-08-22",5980],["2021-08-23",5255],["2021-08-24",9037],["2021-08-25",2877],["2021-08-26",3855],["2021-08-27",8112],["2021-08-28",6288],["2021-08-29",8473],["2021-08-30",5301],["2021-08-31",5852],["2021-09-01",6249],["2021-09-02",7888],["2021-09-03",1798],["2021-09-04",3390],["2021-09-05",947],["2021-09-06",4831],["2021-09-07",6660],["2021-09-08",8115],["2021-09-09",2910],["2021-09-10",1803],["2021-09-11",2808],["2021-09-12",2435],["2021-09-13",7839],["2021-09-14",4711],["2021-09-15",6748],["2021-09-16",1373],["2021-09-17",5040],["2021-09-18",7349],["2021-09-19",5659],["2021-09-20",1345],["2021-09-21",5985],["2021-09-22",4838],["2021-09-23",4079],["2021-09-24",5426],["2021-09-25",1572],["2021-09-26",9009],["2021-09-27",2355],["2021-09-28",7922],["2021-09-29",3125],["2021-09-30",4353],["2021-10-01",5291],["2021-10-02",782],["2021-10-03",4791],["2021-10-04",5825],["2021-10-05",4489],["2021-10-06",9056],["2021-10-07",164],["2021-10-08",1548],["2021-10-09",5180],["2021-10-10",4483],["2021-10-11",755],["2021-10-12",6915],["2021-10-13",5130],["2021-10-14",4944],["2021-10-15",8717],["2021-10-16",4695],["2021-10-17",5564],["2021-10-18",6207],["2021-10-19",5831],["2021-10-20",9304],["2021-10-21",4369],["2021-10-22",9123],["2021-10-23",8537],["2021-10-24",3358],["2021-10-25",7908],["2021-10-26",2478],["2021-10-27",537],["2021-10-28",4602],["2021-10-29",666],["2021-10-30",7921],["2021-10-31",6681],["2021-11-01",2511],["2021-11-02",2260],["2021-11-03",7009],["2021-11-04",6877],["2021-11-05",1279],["2021-11-06",7721],["2021-11-07",9515],["2021-11-08",3804],["2021-11-09",4833],["2021-11-10",4864],["2021-11-11",5067],["2021-11-12",5263],["2021-11-13",38],["2021-11-14",1972],["2021-11-15",5896],["2021-11-16",357],["2021-11-17",693],["2021-11-18",2126],["2021-11-19",8050],["2021-11-20",5832],["2021-11-21",9743],["2021-11-22",4252],["2021-11-23",3557],["2021-11-24",1182],["2021-11-25",5504],["2021-11-26",9899],["2021-11-27",9682],["2021-11-28",3016],["2021-11-29",3290],["2021-11-30",6391],["2021-12-01",178],["2021-12-02",2617],["2021-12-03",3466],["2021-12-04",9634],["2021-12-05",110],["2021-12-06",2871],["2021-12-07",319],["2021-12-08",9424],["2021-12-09",6747],["2021-12-10",8406],["2021-12-11",6040],["2021-12-12",765],["2021-12-13",4958],["2021-12-14",4294],["2021-12-15",6412],["2021-12-16",3565],["2021-12-17",8252],["2021-12-18",3901],["2021-12-19",8385],["2021-12-20",3344],["2021-12-21",9121],["2021-12-22",978],["2021-12-23",1337],["2021-12-24",8579],["2021-12-25",6217],["2021-12-26",1795],["2021-12-27",2093],["2021-12-28",2507],["2021-12-29",2389],["2021-12-30",2124]]
```
:::

### 组件

::: details
```html
<template>
  <div class="schedule-view">
    <div id="schedule-view-chart" />
    <div class="bg1 bg" />
    <div class="bg2 bg" />
  </div>
</template>

<script>
  import Echarts from 'echarts'

  export default {
    name: 'ScheduleView',
    mounted() {
      function getVirtualData(year) {
        year = year || '2020'
        const date = +Echarts.number.parseDate(year + '-06-01')
        const end = +Echarts.number.parseDate((+year + 1) + '-12-31')
        const dayTime = 3600 * 24 * 1000
        const data = []
        for (let time = date; time < end; time += dayTime) {
          data.push([
            Echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
          ])
        }
        return data
      }
      const data = getVirtualData(2020)
      console.log(JSON.stringify(data))
      const option = {
        calendar: [{
          top: 30,
          left: 80,
          right: 40,
          bottom: 10,
          range: ['2020-06-01', '2020-12-31'],
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgb(127, 127, 127)'
            }
          },
          yearLabel: { show: false },
          dayLabel: {
            color: 'rgb(127, 127, 127)',
            fontSize: 18
          },
          monthLabel: {
            color: 'rgb(127, 127, 127)',
            fontSize: 18
          },
          itemStyle: {
            color: 'rgb(48, 48, 48)',
            borderWidth: 1,
            borderColor: 'rgb(48, 48, 48)'
          }
        }],
        series: [
          {
            name: '步数',
            type: 'scatter',
            coordinateSystem: 'calendar',
            data: data,
            symbolSize: function(val) {
              return val[1] / 600
            },
            itemStyle: {
              color: 'rgb(208,248,138)'
            }
          },
          {
            name: 'Top 12',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: data.sort(function(a, b) {
              return b[1] - a[1]
            }).slice(0, 12),
            symbolSize: function(val) {
              return val[1] / 500
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
              color: 'rgb(208,248,138)',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            zlevel: 1
          }
        ]
      }
      this.chart = Echarts.init(document.getElementById('schedule-view-chart'))
      this.chart.setOption(option)
    }
  }
</script>

<style lang="scss" scoped>
  .schedule-view {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(48, 48, 48);
    padding: 20px 0;
    box-sizing: border-box;

    #schedule-view-chart {
      width: 100%;
      height: 100%;
    }

    .bg {
      width: 100%;
      height: 20px;
      background: rgb(72, 122, 72);
    }

    .bg1 {
      position: absolute;
      top: 0;
      left: 0;
    }

    .bg2 {
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
</style>
```
:::

## 区域销售排行组件

### 数据

::: details
```js
/* eslint-disable-next-line */
const salesRankMockData = [{"city":"北京","rate":"-12%","shop":[{"shop":"必胜客","order":484,"sales":9447},{"shop":"肯德基","order":718,"sales":9068},{"shop":"麦当劳","order":332,"sales":5756},{"shop":"海底捞","order":532,"sales":5692}]},{"city":"上海","rate":"-22%","shop":[{"shop":"必胜客","order":432,"sales":4345},{"shop":"肯德基","order":603,"sales":6807},{"shop":"麦当劳","order":949,"sales":13409},{"shop":"海底捞","order":270,"sales":4905}]},{"city":"广州","rate":"+22%","shop":[{"shop":"必胜客","order":836,"sales":14813},{"shop":"肯德基","order":525,"sales":6987},{"shop":"麦当劳","order":799,"sales":13950},{"shop":"海底捞","order":853,"sales":8657}]},{"city":"深圳","rate":"+1%","shop":[{"shop":"必胜客","order":876,"sales":17239},{"shop":"肯德基","order":603,"sales":7808},{"shop":"麦当劳","order":560,"sales":8859},{"shop":"海底捞","order":86,"sales":1564}]},{"city":"南京","rate":"+22%","shop":[{"shop":"必胜客","order":810,"sales":11963},{"shop":"肯德基","order":401,"sales":4727},{"shop":"麦当劳","order":532,"sales":8820},{"shop":"海底捞","order":341,"sales":5606}]},{"city":"杭州","rate":"-23%","shop":[{"shop":"必胜客","order":752,"sales":9407},{"shop":"肯德基","order":920,"sales":13413},{"shop":"麦当劳","order":577,"sales":9959},{"shop":"海底捞","order":353,"sales":3886}]},{"city":"合肥","rate":"-23%","shop":[{"shop":"必胜客","order":781,"sales":11964},{"shop":"肯德基","order":573,"sales":10296},{"shop":"麦当劳","order":86,"sales":1192},{"shop":"海底捞","order":231,"sales":3862}]},{"city":"济南","rate":"+22%","shop":[{"shop":"必胜客","order":34,"sales":479},{"shop":"肯德基","order":781,"sales":13526},{"shop":"麦当劳","order":519,"sales":5605},{"shop":"海底捞","order":916,"sales":15975}]},{"city":"太原","rate":"-6%","shop":[{"shop":"必胜客","order":601,"sales":11094},{"shop":"肯德基","order":646,"sales":11621},{"shop":"麦当劳","order":201,"sales":3083},{"shop":"海底捞","order":45,"sales":579}]},{"city":"成都","rate":"-4%","shop":[{"shop":"必胜客","order":606,"sales":12029},{"shop":"肯德基","order":287,"sales":4322},{"shop":"麦当劳","order":729,"sales":8835},{"shop":"海底捞","order":225,"sales":2925}]},{"city":"重庆","rate":"-14%","shop":[{"shop":"必胜客","order":25,"sales":359},{"shop":"肯德基","order":533,"sales":6166},{"shop":"麦当劳","order":337,"sales":6153},{"shop":"海底捞","order":290,"sales":4622}]},{"city":"苏州","rate":"-19%","shop":[{"shop":"必胜客","order":836,"sales":9413},{"shop":"肯德基","order":986,"sales":11486},{"shop":"麦当劳","order":299,"sales":3695},{"shop":"海底捞","order":147,"sales":2382}]},{"city":"无锡","rate":"-11%","shop":[{"shop":"必胜客","order":415,"sales":5469},{"shop":"肯德基","order":658,"sales":10218},{"shop":"麦当劳","order":339,"sales":3922},{"shop":"海底捞","order":756,"sales":8867}]},{"city":"常州","rate":"-17%","shop":[{"shop":"必胜客","order":444,"sales":7374},{"shop":"肯德基","order":196,"sales":2528},{"shop":"麦当劳","order":409,"sales":7967},{"shop":"海底捞","order":376,"sales":6399}]},{"city":"温州","rate":"+13%","shop":[{"shop":"必胜客","order":612,"sales":9222},{"shop":"肯德基","order":452,"sales":5460},{"shop":"麦当劳","order":190,"sales":2190},{"shop":"海底捞","order":327,"sales":5928}]},{"city":"哈尔滨","rate":"+10%","shop":[{"shop":"必胜客","order":894,"sales":14911},{"shop":"肯德基","order":241,"sales":2610},{"shop":"麦当劳","order":665,"sales":11717},{"shop":"海底捞","order":182,"sales":3412}]},{"city":"长春","rate":"+15%","shop":[{"shop":"必胜客","order":619,"sales":6765},{"shop":"肯德基","order":693,"sales":7726},{"shop":"麦当劳","order":738,"sales":7564},{"shop":"海底捞","order":449,"sales":8953}]},{"city":"大连","rate":"-7%","shop":[{"shop":"必胜客","order":266,"sales":5136},{"shop":"肯德基","order":287,"sales":3022},{"shop":"麦当劳","order":476,"sales":8496},{"shop":"海底捞","order":913,"sales":10873}]},{"city":"沈阳","rate":"+7%","shop":[{"shop":"必胜客","order":650,"sales":8150},{"shop":"肯德基","order":948,"sales":16874},{"shop":"麦当劳","order":693,"sales":7463},{"shop":"海底捞","order":915,"sales":14255}]},{"city":"拉萨","rate":"+8%","shop":[{"shop":"必胜客","order":596,"sales":11079},{"shop":"肯德基","order":640,"sales":12204},{"shop":"麦当劳","order":374,"sales":5366},{"shop":"海底捞","order":169,"sales":2274}]},{"city":"呼和浩特","rate":"-16%","shop":[{"shop":"必胜客","order":971,"sales":11778},{"shop":"肯德基","order":372,"sales":6744},{"shop":"麦当劳","order":123,"sales":1831},{"shop":"海底捞","order":799,"sales":12040}]},{"city":"武汉","rate":"+13%","shop":[{"shop":"必胜客","order":5,"sales":53},{"shop":"肯德基","order":408,"sales":6115},{"shop":"麦当劳","order":557,"sales":7341},{"shop":"海底捞","order":531,"sales":7157}]},{"city":"南宁","rate":"+8%","shop":[{"shop":"必胜客","order":133,"sales":1927},{"shop":"肯德基","order":503,"sales":7077},{"shop":"麦当劳","order":700,"sales":10318},{"shop":"海底捞","order":349,"sales":4882}]}]
```
:::

### 组件

::: details
```html
<template>
  <div class="activate-user">
    <div class="title">地区商家销售排行</div>
    <div class="list-wrapper">
      <div class="list-inner" v-for="(item, index) in headerData" :key="index">
        <div class="list">
          <div class="list-title">{{item.title}}</div>
          <div class="list-separator-wrapper">
            <div class="list-separator" />
          </div>
          <div class="chart-wrapper">
            <div class="img-wrapper">
              <img :src="item.img">
            </div>
            <div class="chart" :id="`activate-user-chart${index + 1}`" />
          </div>
          <div class="category-wrapper">
            <transform-category
              :data="['商家', '订单数', '销售额']"
              :color="['rgb(178, 209, 126)', 'rgb(116, 166, 49)']"
            />
          </div>
          <div class="list-content-wrapper">
            <div class="list-item-wrapper" v-for="(listItem, index) in listData[index].shop" :key="index">
              <div class="list-item">{{listItem.shop}}</div>
              <div class="list-item">{{listItem.order}}</div>
              <div class="list-item list-item-sales">{{listItem.sales}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import { ref, watch, nextTick, onMounted } from 'vue'
  import TransformCategory from '../TransformCategory/index'

  export default {
    name: 'SalesRank',
    components: { TransformCategory },
    props: {
      data: Array
    },
    setup(props) {
      const headerData = ref([])
      const listData = ref([])
      let currentIndex = 0
      const update = () => {
        const currentData = props.data.slice(currentIndex, currentIndex + 3)
        headerData.value = [{
          title: currentData[0].city,
          img: 'https://img.alicdn.com/tfs/TB1Z171qebviK0jSZFNXXaApXXa-30-29.png'
        }, {
          title: currentData[1].city,
          img: 'https://img.alicdn.com/tfs/TB1b8Tzq7T2gK0jSZFkXXcIQFXa-28-24.png'
        }, {
          title: currentData[2].city,
          img: 'https://img.alicdn.com/tfs/TB12MbzqYY1gK0jSZTEXXXDQVXa-28-30.png'
        }]
        listData.value = currentData
        console.log(currentData)
        function createOption() {
          const data = []
          data[0] = Math.ceil(Math.random() * 100)
          data[1] = 100 - data[0]
          return {
            color: ['rgb(210, 244, 148)', 'rgb(79, 79, 79)'],
            grid: {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            },
            title: {
              text: `${data[0]}%`,
              left: 'center',
              top: '60%',
              textStyle: {
                color: 'rgb(210, 244, 148)',
                fontSize: 18,
                align: 'center'
              }
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: data[0],
                    name: '活跃用户'
                  },
                  {
                    value: data[1],
                    name: '非活跃用户'
                  }
                ]
              }
            ]
          }
        }
        nextTick(() => {
          const chart = []
          headerData.value.forEach((item, index) => {
            const id = `activate-user-chart${index + 1}`
            chart[index] = Echarts.init(document.getElementById(id))
            chart[index].setOption(createOption())
          })

          if (currentIndex >= props.data.length - 3) {
            currentIndex = 0
          } else {
            currentIndex++
          }
        })
      }
      onMounted(update)
      watch(() => props.data, () => {
        update()
      })
      return {
        headerData,
        listData
      }
    }
  }
</script>

<style lang="scss" scoped>
  .activate-user {
    width: 100%;
    height: 100%;
    background: rgb(55, 55, 55);
    padding-right: 20px;
    box-sizing: border-box;

    .title {
      font-size: 36px;
      margin-left: 20px;
      padding: 20px 40px 0;
      box-sizing: border-box;
    }

    .list-wrapper {
      display: flex;
      width: 100%;
      height: 563px;
      margin-top: 20px;
      padding: 0 10px;
      box-sizing: border-box;

      .list-inner {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: 0 10px;
        box-sizing: border-box;

        .list {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: rgb(45, 45, 45);

          .list-title {
            font-size: 24px;
            padding: 10px 20px;
            box-sizing: border-box;
          }

          .list-separator-wrapper {
            position: relative;
            height: 30px;
            background: rgb(93, 93, 93);

            .list-separator {
              position: absolute;
              top: 7.5px;
              right: 15px;
              width: 15px;
              height: 15px;
              background: rgb(50, 50, 50);
            }
          }

          .chart-wrapper {
            position: relative;
            width: 100%;
            height: 200px;
            margin-top: 20px;

            .img-wrapper {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              justify-content: center;
              width: 100%;
              height: 100%;

              img {
                width: 42px;
                height: 42px;
                margin-top: 60px;
              }
            }

            .chart {
              width: 100%;
              height: 100%;
            }
          }

          .category-wrapper {
            margin-top: 20px;
          }

          .list-content-wrapper {
            flex: 1;
            margin-top: 20px;
            overflow: hidden;
            .list-item-wrapper {
              display: flex;
              height: 33.33%;
              .list-item {
                display: flex;
                justify-content: center;
                flex: 0 0 33.33%;
                width: 33.33%;
                font-size: 28px;
              }
              .list-item-sales {
                color: rgb(178,209,126);
              }
            }
          }
        }
      }
    }
  }
</style>
```
:::
