# ECharts 复杂图表渲染实战

## timeline 用法解析

[timeline用法](https://echarts.apache.org/zh/option.html#timeline)

::: details
```js
timeline: {
    axisType: 'category', // 坐标轴类型
    realtime: true, // 拖动时是否实时渲染视图
    rewind: false, // 是否启动反向播放，需要将loop置为true
    loop: false, // 是否循环播放
    autoPlay: false, // 是否自动播放
    inverse: false, // 反向置放timeline
    currentIndex: 0, // 起始位置
    playInterval: 1000, // 播放间隔
    controlStyle: {
      position: 'left'
    }, // 播放控制器位置
    data: [
      '2002-01-01', '2003-01-01', '2004-01-01',
      {
        value: '2005-01-01',
        tooltip: {
          formatter: '{b} GDP达到一个高度'
        },
        symbol: 'diamond',
        symbolSize: 16
      },
      '2006-01-01', '2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01',
      {
        value: '2011-01-01',
        tooltip: {
          formatter: function(params) {
            return params.name + 'GDP达到又一个高度'
          }
        },
        symbol: 'diamond',
        symbolSize: 18
      }
    ], // timeline数据源
    label: {
      formatter: function(s) {
        return (new Date(s)).getFullYear()
      }
    } // timeline坐标值
  }
```
:::

## baseOption 基本用法

::: details
```js
const options = ref({})
options.value = {
    baseOption: {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
}
return {
  options
}
```
:::

[官网案例](https://echarts.apache.org/examples/zh/editor.html?c=doc-example/mix-timeline-all)

## 自定义 Map

### 地图数据

[地图数据接口](http://www.youbaobao.xyz/datav-res/datav/jiangsuMapData.json)

### 城市数据

```js
const center = {
  '南京市': [118.767413, 32.041544],
  '无锡市': [120.301663, 31.574729],
  '徐州市': [117.184811, 34.261792],
  '常州市': [119.946973, 31.772752],
  '苏州市': [120.619585, 31.299379],
  '南通市': [120.864608, 32.016212],
  '连云港市': [119.178821, 34.600018],
  '淮安市': [119.021265, 33.597506],
  '盐城市': [120.139998, 33.377631],
  '扬州市': [119.421003, 32.393159],
  '镇江市': [119.452753, 32.204402],
  '泰州市': [119.915176, 32.484882],
  '宿迁市': [118.275162, 33.963008]
}
```

### 实战案例

::: details
```html
setup () {
  const options = ref({})
  const update = () => {
    /* eslint-disable */
    fetch('http://www.youbaobao.xyz/datav-res/datav/jiangsuMapData.json')
      .then(response => response.json())
      .then(data => {
        var center = {
          '南京市': [118.767413, 32.041544],
          '无锡市': [120.301663, 31.574729],
          '徐州市': [117.184811, 34.261792],
          '常州市': [119.946973, 31.772752],
          '苏州市': [120.619585, 31.299379],
          '南通市': [120.864608, 32.016212],
          '连云港市': [119.178821, 34.600018],
          '淮安市': [119.021265, 33.597506],
          '盐城市': [120.139998, 33.377631],
          '扬州市': [119.421003, 32.393159],
          '镇江市': [119.452753, 32.204402],
          '泰州市': [119.915176, 32.484882],
          '宿迁市': [118.275162, 33.963008]
        }
        echarts.registerMap('js', data)
        options.value = {
          visualMap: {
            show: true,
            max: 100,
            seriesIndex: [3],
            inRange: {
              color: ['#A5DCF4', '#006edd']
            }
          },
          geo: [{
            map: 'js',
            roam: false, //是否允许缩放
            zoom: 1.1, //默认显示级别
            scaleLimit: {
              min: 0,
              max: 3
            }, //缩放级别
            itemStyle: {
              normal: {
                areaColor: '#013C62',
                shadowColor: '#013C62',
                shadowBlur: 20,
                shadowOffsetX: -5,
                shadowOffsetY: 15
              }
            },
            tooltip: {
              show: false
            }
          }],
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 5,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}'
                  },
                  position: 'top',
                  backgroundColor: 'rgba(254,174,33,.8)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#f7fafb',
                  rich: {
                    fline: {
                      padding: [0, 10, 10, 10],
                      color: '#fff'
                    },
                    tline: {
                      padding: [10, 10, 0, 10],
                      color: '#fff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#feae21'
              }
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 5,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}'
                  },
                  position: 'top',
                  backgroundColor: 'rgba(233,63,66,.9)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#ffffff',
                  rich: {
                    fline: {
                      padding: [0, 10, 10, 10],
                      color: '#ffffff'
                    },
                    tline: {
                      padding: [10, 10, 0, 10],
                      color: '#ffffff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#e93f42'
              }
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 5,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    return '{fline|地点：' + params.data.city + '}\n{tline|' + (params.data.info || '发生xx集件') + '}'
                  },
                  position: 'top',
                  backgroundColor: 'rgba(8,186,236,.9)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#ffffff',
                  rich: {
                    fline: {
                      padding: [0, 10, 10, 10],
                      color: '#ffffff'
                    },
                    tline: {
                      padding: [10, 10, 0, 10],
                      color: '#ffffff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#08baec'
              }
            },
            {
              type: 'map',
              mapType: 'js',
              geoIndex: -1,
              zoom: 1.1, //默认显示级别
              label: {
                show: true,
                color: '#ffffff',
                emphasis: {
                  color: 'white',
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#2980b9',
                  borderWidth: 1,
                  areaColor: '#12235c'
                },
                emphasis: {
                  areaColor: '#FA8C16',
                  borderWidth: 0,
                  color: 'green'
                }
              },
              data: Object.keys(center).map(name => {
                return {
                  name: name,
                  value: Math.random() * 100
                }
              })
            }
          ]
        }

        var timer = setInterval(() => {
          const _options = cloneDeep(options.value)
          for (var i = 0; i < 3; i++) {
            _options.series[i].data = []
          }
          var cityIndex = Math.floor(Math.random() * 13)
          var runidx = Math.floor(Math.random() * 3)
          var coordCity = Object.keys(center)[cityIndex]
          var coord = center[coordCity]
          _options.series[runidx].data = [{
            city: coordCity,
            value: coord
          }]
          options.value = _options
        }, 2000)
      })
  }
  onMounted(() => {
    update()
  })

  return {
    options
  }
}
```
:::
