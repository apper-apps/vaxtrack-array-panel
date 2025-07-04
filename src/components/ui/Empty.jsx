import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  message = "There's no data to display at the moment.",
  action,
  actionLabel = "Add New",
  icon = "Package"
}) => {
  return (
    <Card className="max-w-md mx-auto text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {action && (
          <Button variant="primary" onClick={action} icon="Plus">
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </Card>
  )
}

export default Empty