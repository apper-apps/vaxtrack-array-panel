import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showRetry = true
}) => {
  return (
    <Card className="max-w-md mx-auto text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {showRetry && (
          <div className="flex justify-center space-x-4">
            <Button variant="primary" onClick={onRetry} icon="RefreshCw">
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} icon="Home">
              Go Home
            </Button>
          </div>
        )}
      </motion.div>
    </Card>
  )
}

export default Error