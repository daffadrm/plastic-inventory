import { useCallback } from 'react'

// Type definitions
export type StatusPieChart = string

// Define the chart data structure
export interface ChartData {
  pie_chart: {
    data: Array<{ name: string; value: number }>
    complete: number
    total: number
  }
  workshops: {
    data: Array<{ name: string; value: number; avg_duration_seconds_label?: string; company_name?: string }>
    complete: number
    total: number
    type: string | undefined
  }
  product_bestseller: {
    data: Array<{ name: string; value: number }>
    complete: number
    total: number
  }
}

// Define pie chart configuration props
export interface PieChartSizeProps {
  fontSize: number
  radius: number
}

const defaultChartData = {
  pie_chart: {
    data: [],
    complete: 0,
    total: 0
  },
  workshops: {
    data: [],
    complete: 0,
    total: 0,
    type: ''
  },
  product_bestseller: {
    data: [],
    complete: 0,
    total: 0
  }
}

// Create a custom hook that returns both chart option generators
export function useChartOptions(pieChartSizeProps: PieChartSizeProps) {
  console.log(pieChartSizeProps, 'pieChartSizeProps')

  const optionsBar = useCallback(
    (dataParam = defaultChartData.product_bestseller, onBarClick?: (name: string) => void) => {
      let scale = 1

      if (typeof window !== 'undefined') {
        scale = window.devicePixelRatio
      }

      // Reverse the array without sorting
      const reversedData = [...(dataParam?.data || [])].reverse()

      const labelLength = reversedData?.map(
        (item: { value: number }) => Intl.NumberFormat().format(item?.value || 0)?.length
      )

      const maxLabelLength = Math.max(...labelLength)
      const marginAxisLabel = maxLabelLength < 2 ? 15 : Math.floor((maxLabelLength - 2) / 2) * 15 + 15

      return {
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 10,
          containLabel: true
        },
        tooltip: {
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            fontSize: 13 / scale
          },
          confine: true,
          position: (
            point: [number, number],
            params: any,
            dom: any,
            rect: any,
            size: { contentSize: any; viewSize: any }
          ) => {
            const [mouseX] = point

            // Check if size, contentSize and viewSize are defined before accessing properties
            if (!size || !size.contentSize || !size.viewSize) {
              return [mouseX + 5, point[1]] // Default fallback position
            }

            const { contentSize, viewSize } = size

            return mouseX < viewSize[0] / 2 ? [mouseX + 5, point[1]] : [mouseX - contentSize[0] - 5, point[1]]
          }
        },
        legend: {
          selectedMode: true,
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 11
          },
          itemWidth: 20,
          itemHeight: 10
        },
        xAxis: {
          type: 'value',
          show: false
        },
        yAxis: [
          {
            type: 'category',
            show: true,
            data: reversedData.map((item: any) => item?.name) || [],
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'category',
            show: true,

            data: reversedData.map((item: any) => Intl.NumberFormat().format(item?.value || 0)) || [],

            axisLabel: {
              interval: 0,
              fontSize: 9,
              lineHeight: 10,
              fontWeight: 'bold',
              align: 'right',
              margin: marginAxisLabel
            },
            position: 'right',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            stack: 'total',
            type: 'bar',
            barWidth: 24,
            barCategoryGap: 0,
            barGap: 0,
            labelLine: {
              show: true
            },
            data:
              reversedData.map((item: any) => ({
                value: item.value,
                itemStyle: { color: '#baccff' },
                name: item.name
              })) || [],
            label: {
              show: true,
              position: 'insideLeft',
              valueAnimation: true,
              fontWeight: 'bold',
              fontSize: 10,
              formatter: (params: any) => `${params.name}`,
              rich: {
                bold: {
                  fontWeight: 'bold',
                  fontSize: 10,
                  padding: [2, 0, 0, 0]
                },
                normal: {
                  fontWeight: 'normal',
                  fontSize: 10,
                  padding: [2, 0, 0, 0]
                }
              }
            }
          }
        ],

        // Handle click events for the chart
        onClick: function (params: any) {
          if (params.seriesType === 'bar' && onBarClick) {
            // Call the provided click handler with the name of the clicked bar
            onBarClick(params.name)
          }
        }
      }
    },
    []
  )

  return { optionsBar }
}
