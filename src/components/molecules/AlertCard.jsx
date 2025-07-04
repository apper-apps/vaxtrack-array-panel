import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const AlertCard = ({ 
  title, 
  count, 
  variant = 'warning', 
  icon, 
  onClick,
  className = '' 
}) => {
  const variantConfig = {
    warning: {
      bgGradient: 'from-warning/10 to-yellow-100',
      iconColor: 'text-warning',
      countColor: 'text-warning'
    },
    error: {
      bgGradient: 'from-error/10 to-red-100',
      iconColor: 'text-error',
      countColor: 'text-error'
    },
    info: {
      bgGradient: 'from-info/10 to-blue-100',
      iconColor: 'text-info',
      countColor: 'text-info'
    }
  }
  
  const config = variantConfig[variant]
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={`bg-gradient-to-br ${config.bgGradient} border-0 cursor-pointer hover:shadow-lg transition-all duration-200`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white/50 ${config.iconColor}`}>
              <ApperIcon name={icon} size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{title}</p>
              <p className={`text-2xl font-bold ${config.countColor}`}>{count}</p>
            </div>
          </div>
          <Badge variant={variant} size="lg">
            {count}
          </Badge>
        </div>
      </Card>
    </motion.div>
  )
}

export default AlertCard