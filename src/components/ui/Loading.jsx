import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48 shimmer"></div>
            <div className="h-8 bg-gray-200 rounded w-24 shimmer"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
  
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
              <div className="w-16 h-6 bg-gray-200 rounded shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 shimmer"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }
  
  if (type === 'form') {
    return (
      <Card>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64 shimmer"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                <div className="h-12 bg-gray-200 rounded shimmer"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <div className="w-20 h-10 bg-gray-200 rounded shimmer"></div>
            <div className="w-24 h-10 bg-gray-200 rounded shimmer"></div>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <motion.div
          className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loading