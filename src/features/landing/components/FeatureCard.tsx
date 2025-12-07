import React from 'react'
import { FeatureCardProps } from '../types/landing.types'
import { Layers, Zap, Activity, DollarSign, Route, BarChart, Server } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  layers: <Layers className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  activity: <Activity className="w-8 h-8" />,
  'dollar-sign': <DollarSign className="w-8 h-8" />,
  route: <Route className="w-8 h-8" />,
  'bar-chart': <BarChart className="w-8 h-8" />,
  server: <Server className="w-8 h-8" />,
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  const iconElement = icon && typeof icon === 'string' ? iconMap[icon] : null

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] cursor-pointer h-full group">
      {iconElement && (
        <div className="text-primary transition-transform duration-300 group-hover:scale-110 origin-center">
          {iconElement}
        </div>
      )}
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-white text-lg font-medium leading-tight">{title}</h2>
        <div className="flex flex-col gap-2">
          <p className="text-white/70 text-sm font-normal leading-relaxed">{description.ko}</p>
          <p className="text-white/50 text-xs font-normal leading-relaxed">{description.ja}</p>
        </div>
      </div>
    </div>
  )
}
