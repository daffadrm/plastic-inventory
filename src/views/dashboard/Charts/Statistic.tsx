import React from 'react'

import CustomAvatar from '@/@core/components/mui/Avatar'

type CardColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'

type StatisticData = {
  id: string
  color: CardColor
  avatarIcon: string
  value: any
  label: string
  description?: string
}

type CardGridProps = {
  statisticData: StatisticData
}

const StatisticOverview: React.FC<CardGridProps> = ({ statisticData }) => {
  return (
    <div className='grid grid-cols-1 gap-1 rounded h-full'>
      <div key={statisticData.id}>
        <div className='flex flex-col gap-1 bg-white p-2 h-full justify-center border rounded'>
          <div className='flex items-center gap-4'>
            <CustomAvatar color={statisticData.color} skin='light' variant='rounded' size={30}>
              <i
                className={`${statisticData.avatarIcon} text-[10px]`}
                style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}
              />
            </CustomAvatar>
            <p className='font-bold text-gray-700' style={{ fontSize: 'clamp(1.5rem, 2.3vw, 2.5rem)' }}>
              {statisticData.value}
            </p>
            {statisticData.description && (
              <span
                className='text-md'
                style={{
                  fontSize: 'clamp(0.8rem, 2.5vw, 1.0rem)'
                }}
              >
                {statisticData?.description}
              </span>
            )}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <span className='font-semibold' style={{ fontSize: 'clamp(0.5rem, 2.3vw, 0.85rem)' }}>
              {statisticData.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticOverview
