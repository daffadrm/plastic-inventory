'use client'

import React, { useEffect, useMemo, useState } from 'react'

import EChartsReact from 'echarts-for-react'

import { colorChartBusiness, colorTimeBussinees } from '@/utils/colorCharts'

interface CustomChartProps {
  chartData?: any
  xAxisType: 'category' | 'value'
  yAxisType: 'category' | 'value'
  gridTop?: number
  gridBottom?: number
  gridRight?: number
  gridLeft?: any
  rotatelabel?: number
  axisLabelInterval?: number
  positionLabelSeries?: string
  typeData?: string
}

const BarCharts: React.FC<CustomChartProps> = ({
  chartData,
  xAxisType,
  yAxisType,
  positionLabelSeries,
  gridTop = 20,
  gridBottom = 40,
  gridRight = 40,
  gridLeft = 40,
  typeData
}) => {
  const [echartsInstance, setEchartsInstance] = useState<any>(null)

  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  const series = useMemo(() => {
    if (
      !chartData ||
      !chartData?.categories ||
      !chartData?.value ||
      chartData?.categories?.length === 0 ||
      chartData?.value?.length === 0
    ) {
      return []
    }

    const barSeries = chartData?.value
      ?.filter((item: any) => item?.name !== 'Total Harga Barang')
      ?.map((item: any) => ({
        name: item?.name,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        label: {
          show: false,
          position: 'top'
        },
        data: item?.data,
        color:
          typeData === 'linebar'
            ? colorChartBusiness(item?.name?.toLowerCase())
            : colorTimeBussinees(item?.name?.toLowerCase())
      }))

    const lineSeries =
      typeData === 'linebar'
        ? chartData?.value
            ?.filter((item: any) => item?.name === 'Total Harga Barang')
            ?.map((item: any) => ({
              name: item.name,
              type: 'line',
              yAxisIndex: 1,
              data: item.data,
              lineStyle: {
                color: '#5c95ff',
                width: 3,
                type: 'solid'
              },
              itemStyle: {
                color: '#5c95ff'
              }
            }))
        : []

    const totalSeries = {
      name: 'Total',
      type: 'bar',
      stack: 'total',
      z: 10,
      label: {
        show: true,
        position: positionLabelSeries,
        formatter: (params: { dataIndex: string | number }) => {
          if (!echartsInstance) return 0

          const model = echartsInstance.getModel()
          const option = echartsInstance.getOption()

          const activeSeries = option.series.filter((s: any) => {
            const isHidden = model.getComponent('legend')?.option?.selected[s.name] === false

            return s.type === 'bar' && s.name !== 'Total' && !isHidden
          })

          let total = 0

          activeSeries.forEach((series: { data: { [x: string]: any } }) => {
            total += series.data[params.dataIndex] || 0
          })

          return total !== 0 ? total.toLocaleString() : ''
        },
        fontSize: 10,
        fontWeight: 'bold'
      },
      itemStyle: {
        color: 'transparent'
      },
      data: new Array(chartData?.categories?.length).fill(0)
    }

    return [...barSeries, ...lineSeries, totalSeries]
  }, [chartData, positionLabelSeries, typeData, echartsInstance])

  const yAxis = useMemo(() => {
    if (typeData === 'linebar') {
      return [
        {
          type: 'value',
          name: 'Total Jumlah Barang',
          position: 'left',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            fontSize: 12 / pixelRatio,
            formatter: (value: any) => value?.toLocaleString()
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: 'Total Harga Barang',
          position: 'right',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            fontSize: 12 / pixelRatio,
            formatter: (value: any) => value?.toLocaleString()
          },
          splitLine: {
            show: false
          }
        }
      ]
    }

    // Default for bar-only
    return [
      {
        type: yAxisType,

        axisLine: {
          show: false
        },
        show: yAxisType === 'value' ? false : true,
        axisTick: {
          show: false
        },
        axisLabel: {
          inside: true,
          fontWeight: 'bold',
          z: 10,
          color: '#555555',
          interval: 0,
          fontSize: 12 / pixelRatio,
          lineHeight: 10,
          width: 50,
          formatter: (value: any) => {
            const validName = value && value.trim() !== '' ? value : '-'

            return validName
          }
        },
        data: chartData?.categories
      }
    ]
  }, [typeData, yAxisType, pixelRatio, chartData?.categories])

  useEffect(() => {
    if (!echartsInstance) return

    const chartDom = echartsInstance.getDom()
    const parent = chartDom?.parentElement

    if (!parent) return

    const resizeObserver = new ResizeObserver(() => {
      echartsInstance.resize()
    })

    resizeObserver.observe(parent)

    const handleResize = () => {
      echartsInstance.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [echartsInstance])

  return (
    <div className='h-full'>
      <EChartsReact
        onChartReady={chart => setEchartsInstance(chart)}
        style={{
          width: '100%',
          height: '100%'
        }}
        option={{
          legend: {
            top: 5,
            bottom: 20,
            orient: 'horizontal',
            data: chartData?.value?.map((item: { name: any }) => item?.name),
            textStyle: {
              fontSize: 12 / pixelRatio
            },
            itemWidth: 15,
            itemHeight: 10
          },
          grid: {
            top: gridTop,
            left: gridLeft,
            bottom: gridBottom,
            right: gridRight
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: 12 / pixelRatio
            },
            axisPointer: {
              type: 'shadow'
            },
            confine: true,
            formatter: function (params: any[]) {
              let tooltipText = `<div style="font-weight: bold">${params[0].axisValue || '-'}</div>`
              let total = 0

              params.forEach(item => {
                tooltipText += `<div style="display: flex; justify-content: space-between;">
                                  ${
                                    item.seriesName !== 'Total'
                                      ? `<span>${item.marker} ${item.seriesName}</span>
                                  <span style="margin-left: 15px; font-weight: 600;">${item.value.toLocaleString()}</span>`
                                      : ''
                                  }
                                </div>`
                total += item.value
              })

              tooltipText += `<div style="display: flex; justify-content: space-between;">
                                <span>Total</span>
                                <span>${total.toLocaleString()}</span>
                              </div>`

              return tooltipText
            }
          },
          yAxis: yAxis,
          xAxis: {
            type: xAxisType,
            data: chartData?.categories,
            axisLine: {
              show: false
            },
            show: xAxisType === 'value' ? false : true,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              formatter:
                typeData !== 'linebar'
                  ? (value: any, index: any) => {
                      let newlines = ''

                      if (index % 2 === 1) {
                        newlines = '\n\n'
                      }

                      if (chartData?.categories?.length > 9) {
                        return `${newlines}${value}`
                      } else {
                        return `${value}`
                      }
                    }
                  : undefined,
              fontSize: 12 / pixelRatio,
              lineHeight: 10,
              rotate: 0
            }
          },
          series: series,
          responsive: true
        }}
        lazyUpdate
      />
    </div>
  )
}

export default BarCharts
