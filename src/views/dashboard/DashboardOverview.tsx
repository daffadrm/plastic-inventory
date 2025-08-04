'use client'
import React, { useEffect, useState } from 'react'

import EChartsReact from 'echarts-for-react'

import { Card, CircularProgress } from '@mui/material'

import Statistic from './Charts/Statistic'
import { useChartOptions } from './Charts/optionCharts'
import BarCharts from './Charts/barCharts'
import TransactionTable from './Table/TransactionTable'
import { useDashboardStore } from '@/stores/dashboardStore'

type CardColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'

interface CardData {
  id: string
  color: CardColor
  avatarIcon: string
  value: number
  label: string
  description?: string
}

type StatusItem = {
  name: string
  value: number
  avg_duration_seconds_label?: string
  avg_duration_seconds?: number
  workshop_name?: string
  company_name?: string
}

export type TransformedData = {
  complete: number
  data: StatusItem[]
  total: number
  type: string | undefined
}

export default function DashboardOverview() {
  const { dataList, fetchDashboard, isLoading } = useDashboardStore()
  const [echartsInstance, setEchartsInstance] = useState<any>(null)

  console.log(dataList)

  const cardData: CardData[] = [
    {
      id: 'avg_daily',
      color: 'primary',
      avatarIcon: 'tabler-database',
      value: dataList?.statistic?.total_product?.toLocaleString() || 0,
      label: 'Total Produk'
    },
    {
      id: 'avg_monthly',
      color: 'success',
      avatarIcon: 'tabler-stack-push',
      value: dataList?.statistic?.items_in?.toLocaleString() || 0,
      label: 'Barang Masuk Hari ini'
    },
    {
      id: 'peak_visitor',
      color: 'error',
      avatarIcon: 'tabler-stack-pop',
      value: dataList?.statistic?.items_out?.toLocaleString() || 0,
      label: `Barang Keluar Hari ini`
    },
    {
      id: 'total_visitor',
      color: 'info',
      avatarIcon: 'tabler-arrows-up-down',
      value: dataList?.statistic?.total_transaction?.toLocaleString() || 0,
      label: 'Total Transaksi'
    }
  ]

  const width = typeof window !== 'undefined' ? window.innerWidth : 1024

  const [piechartSizeState, setPiechartSizeState] = useState<{ fontSize: number; radius: number }>({
    fontSize: Math.max(width * 0.02, 12),
    radius: Math.min(Math.max(width * 0.1, 10), 162)
  })

  const { optionsBar } = useChartOptions(piechartSizeState)

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
      if (typeof window !== 'undefined') {
        setPiechartSizeState({
          fontSize: Math.max(window.innerWidth * 0.02, 12),
          radius: Math.min(Math.max(window.innerWidth * 0.1, 40), 162)
        })
      }

      echartsInstance.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [echartsInstance])

  function transformData(input: StatusItem[], type?: string): any {
    const total = input?.reduce((sum, item) => sum + item?.value, 0) || 0

    const complete = input?.find(item => item.name === 'Pending')?.value || 0

    const data = input?.map(item => ({
      name: item?.name || '',
      value: item?.value || 0,
      avg_duration_seconds_label: item?.avg_duration_seconds_label || '',
      company_name: item?.company_name || ''
    }))

    return {
      complete,
      data,
      total: total,
      type: type
    }
  }

  useEffect(() => {
    fetchDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className='is-full h-screen grid grid-cols-12 gap-2 grid-rows-12'
      style={{
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'visible'
      }}
    >
      {isLoading ? (
        <Card className='bg-white col-span-12 row-span-12 rounded px-2 py-2 flex justify-center items-center'>
          <CircularProgress />
        </Card>
      ) : (
        <>
          <Card className='col-span-3 row-span-2'>
            <Statistic statisticData={cardData[0]} />
          </Card>
          <Card className='col-span-3 row-span-2'>
            <Statistic statisticData={cardData[1]} />
          </Card>
          <Card className='col-span-3 row-span-2'>
            <Statistic statisticData={cardData[2]} />
          </Card>
          <Card className='col-span-3 row-span-2'>
            <Statistic statisticData={cardData[3]} />
          </Card>
          <Card className='col-span-6 border row-span-5 px-2 py-2'>
            <div className='text-sm font-bold'>Transaksi Total Barang</div>
            <BarCharts
              yAxisType='value'
              xAxisType='category'
              chartData={dataList?.total_items_transaction || []}
              positionLabelSeries='top'
              typeData='status'
              gridRight={20}
              gridTop={40}
              gridBottom={60}
            />
          </Card>
          <Card className='col-span-6 border row-span-5 px-2 py-2'>
            <div className='text-sm font-bold'>Total Nilai Penjualan</div>

            <BarCharts
              yAxisType='value'
              xAxisType='category'
              chartData={dataList?.total_value_transaction || []}
              positionLabelSeries='top'
              gridBottom={50}
              gridTop={50}
              gridRight={80}
              gridLeft={60}
              typeData='linebar'
            />
          </Card>
          <Card className='col-span-4 border row-span-5 px-2 py-2'>
            <div className='text-sm font-bold'>10 Produk Menipis</div>
            <EChartsReact
              onChartReady={chart => setEchartsInstance(chart)}
              style={{
                width: '100%',
                height: '100%'
              }}
              option={optionsBar(transformData(dataList?.product_stock_low ?? []))}
              lazyUpdate
            />
          </Card>
          <Card className='col-span-4 border row-span-5 px-2 py-2'>
            <div className='text-sm font-bold'>10 Produk Terlaris</div>
            <EChartsReact
              onChartReady={chart => setEchartsInstance(chart)}
              style={{
                width: '100%',
                height: '100%'
              }}
              option={optionsBar(transformData(dataList?.product_bestseller ?? []))}
              lazyUpdate
            />
          </Card>

          <Card className='bg-white col-span-4 border row-span-5 px-2 py-2 h-full'>
            <div className='text-sm font-bold'>Penjualan Terbaru</div>
            <TransactionTable dataTable={dataList?.history_transaction || []} />
          </Card>
        </>
      )}
    </div>
  )
}
