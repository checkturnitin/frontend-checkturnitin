import { type LucideIcon } from 'lucide-react'

interface FeatureItemProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-800 rounded-lg">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-[#ffaa40]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  )
}

