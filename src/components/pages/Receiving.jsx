import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VaccineReceivingForm from '@/components/organisms/VaccineReceivingForm'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { receiptService } from '@/services/api/receiptService'
import { format } from 'date-fns'

const Receiving = () => {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const loadReceipts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await receiptService.getAll()
      setReceipts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadReceipts()
  }, [])
  
  const handleReceivingSuccess = () => {
    loadReceipts()
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="form" />
        <Loading type="table" />
      </div>
    )
  }
  
  if (error) {
    return <Error onRetry={loadReceipts} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vaccine Receiving</h1>
        <p className="mt-2 text-gray-600">Process incoming vaccine shipments and record inspection results</p>
      </div>
      
      {/* Receiving Form */}
      <VaccineReceivingForm onSuccess={handleReceivingSuccess} />
      
      {/* Recent Receipts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Receipts</h2>
        
        {receipts.length === 0 ? (
          <Empty
            title="No receipts found"
            message="Start by receiving your first vaccine shipment"
            icon="PackageOpen"
          />
        ) : (
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <motion.div
                key={receipt.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:shadow-lg transition-shadow"
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <ApperIcon name="PackageOpen" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Receipt #{receipt.Id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Received on {format(new Date(receipt.dateReceived), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Quantity Received</p>
                        <p className="font-semibold text-gray-900">{receipt.quantityReceived}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Passed Inspection</p>
                        <p className="font-semibold text-success">{receipt.dosesPassed}</p>
                      </div>
                      {receipt.dosesFailed > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Failed Inspection</p>
                          <p className="font-semibold text-error">{receipt.dosesFailed}</p>
                        </div>
                      )}
                      <Badge 
                        variant={receipt.dosesFailed > 0 ? "warning" : "success"}
                        icon={receipt.dosesFailed > 0 ? "AlertTriangle" : "CheckCircle"}
                      >
                        {receipt.dosesFailed > 0 ? "With Issues" : "Clean"}
                      </Badge>
                    </div>
                  </div>
                  
                  {receipt.discrepancyReason && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Discrepancy Noted:</p>
                      <p className="text-sm text-yellow-700">{receipt.discrepancyReason}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Receiving