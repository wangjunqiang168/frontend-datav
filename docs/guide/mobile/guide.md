# 移动报表项目指南

## 旭日图

::: details
```html
<template>
  <div class="sales-sun">
    <div class="sales-sun-inner">
      <vue-echarts :options="options" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SalesSun',
    data () {
      return {
        options: {}
      }
    },
    mounted () {
      const colors = ['rgb(0,211,255)', 'rgb(0,123,255)', 'rgb(0,218,234)', 'rgb(35,69,145)', '#9A2555']
      const bgColor = '#2E2733'

      const itemStyle = {
        star5: {
          color: colors[0]
        },
        star4: {
          color: colors[1]
        },
        star3: {
          color: colors[2]
        },
        star2: {
          color: colors[3]
        }
      }

      const data = [{
        name: '小食',
        itemStyle: {
          color: colors[1]
        },
        children: [{
          name: '奶茶',
          children: [{
            name: '5☆',
            children: [{
              name: '港式奶茶'
            }, {
              name: '珍珠奶茶'
            }]
          }]
        }, {
          name: '串串',
          children: [{
            name: '5☆',
            children: [{
              name: '羊肉串'
            }]
          }, {
            name: '4☆',
            children: [{
              name: '牛肉串'
            }, {
              name: '猪肉串'
            }]
          }, {
            name: '3☆',
            children: [{
              name: '其他'
            }]
          }]
        }]
      }, {
        name: '主食',
        itemStyle: {
          color: colors[2]
        },
        children: [{
          name: '米饭',
          children: [{
            name: '5☆',
            children: [{
              name: '王者炒饭'
            }]
          }, {
            name: '4☆',
            children: [{
              name: '套餐'
            }, {
              name: '轻食'
            }]
          }]
        }, {
          name: '粥',
          children: [{
            name: '5☆',
            children: [{
              name: '牛肉粥'
            }]
          }, {
            name: '4☆',
            children: [{
              name: '白米粥'
            }, {
              name: '红豆粥'
            }]
          }]
        }, {
          name: '西餐',
          children: [{
            name: '5☆',
            children: [{
              name: '汉堡'
            }]
          }, {
            name: '4☆',
            children: [{
              name: '薯条'
            }, {
              name: '薯饼'
            }]
          }]
        }]
      }]

      for (let j = 0; j < data.length; ++j) {
        const level1 = data[j].children
        for (let i = 0; i < level1.length; ++i) {
          const block = level1[i].children
          const bookScore = []
          let bookScoreId
          for (let star = 0; star < block.length; ++star) {
            let style = (function (name) {
              switch (name) {
                case '5☆':
                  bookScoreId = 0
                  return itemStyle.star5
                case '4☆':
                  bookScoreId = 1
                  return itemStyle.star4
                case '3☆':
                  bookScoreId = 2
                  return itemStyle.star3
                case '2☆':
                  bookScoreId = 3
                  return itemStyle.star2
              }
            })(block[star].name)

            block[star].label = {
              color: style.color,
              downplay: {
                opacity: 0.5
              }
            }

            if (block[star].children) {
              style = {
                opacity: 1,
                color: style.color
              }
              block[star].children.forEach(function (book) {
                book.value = 1
                book.itemStyle = style

                book.label = {
                  color: style.color
                }

                let value = 1
                if (bookScoreId === 0 || bookScoreId === 3) {
                  value = 5
                }

                if (bookScore[bookScoreId]) {
                  bookScore[bookScoreId].value += value
                } else {
                  bookScore[bookScoreId] = {
                    color: colors[bookScoreId],
                    value: value
                  }
                }
              })
            }
          }

          level1[i].itemStyle = {
            color: data[j].itemStyle.color
          }
        }
      }

      // 渲染echarts旭日图
      this.options = {}

    }
  }
</script>

<style lang="scss" scoped>
  .sales-sun {
    position: absolute;
    top: 2450px;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 800px;
    padding: 25px 25px 0;
    box-sizing: border-box;

    .sales-sun-inner {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .05);
    }
  }
</style>
```
:::

## 雷达图

::: details
```html
<template>
  <div class="sales-radar">
    <div class="sales-radar-inner">
      <vue-echarts :options="options" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SalesRadar',
    data () {
      return {
        options: {}
      }
    },
    mounted () {
      // 渲染echarts雷达图
      this.options = {}
    }
  }
</script>

<style lang="scss" scoped>
  .sales-radar {
    position: absolute;
    top: 3250px;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 800px;
    padding: 25px 25px 0;
    box-sizing: border-box;

    .sales-radar-inner {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .05);
    }
  }
</style>
```
:::
