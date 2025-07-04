import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'
import { reconciliationService } from '@/services/api/reconciliationService'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { format } from 'date-fns'

const Reconciliation = () => {
  const [formData, setFormData] = useState({
    lotId: '',
    expectedQuantity: '',
    actualQuantity: '',
    adjustmentReason: ''
  })
  const [vaccineLots, setVaccineLots] = useState([])
  const [reconciliations, setReconciliations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedLot, setSelectedLot] = useState(null)
  
  const adjustmentReasons = [
    { value: 'physical-count', label: 'Physical Count Discrepancy' },
    { value: 'damaged', label: 'Damaged/Broken Vials' },
    { value: 'expired', label: 'Expired Doses' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'administration-error', label: 'Administration Recording Error' },
    { value: 'transfer', label: 'Transfer to Another Facility' },
    { value: 'other', label: 'Other' }
  ]
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [lotsData, reconciliationsData] = await Promise.all([
        vaccineLotService.getAll(),
        reconciliationService.getAll()
      ])
      
      setVaccineLots(lotsData.map(lot => ({
        value: lot.Id,
        label: `${lot.vaccine} - Lot ${lot.lotNumber} (${lot.quantityOnHand} on hand)`,
        lot: lot
      })))
      
      setReconciliations(reconciliationsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'lotId') {
      const lot = vaccineLots.find(l => l.value === parseInt(value))?.lot
      setSelectedLot(lot)
      if (lot) {
        setFormData(prev => ({
          ...prev,
          expectedQuantity: lot.quantityOnHand.toString()
        }))
      }
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const expected = parseInt(formData.expectedQuantity)
      const actual = parseInt(formData.actualQuantity)
      const adjustmentAmount = actual - expected
      
      if (!selectedLot) {
        toast.error('Please select a vaccine lot')
        return
      }
      
      // Create reconciliation record
      const reconciliationData = {
        date: new Date().toISOString().split('T')[0],
        lotId: parseInt(formData.lotId),
        expectedQuantity: expected,
        actualQuantity: actual,
        adjustmentReason: formData.adjustmentReason,
        adjustmentAmount: adjustmentAmount
      }
      
      await reconciliationService.create(reconciliationData)
      
      // Update lot quantity if there's an adjustment
      if (adjustmentAmount !== 0) {
        await vaccineLotService.update(parseInt(formData.lotId), {
          quantityOnHand: actual
        })
      }
      
      toast.success('Reconciliation completed successfully!')
      
      // Reset form
      setFormData({
        lotId: '',
        expectedQuantity: '',
        actualQuantity: '',
        adjustmentReason: ''
      })
      setSelectedLot(null)
      
      // Reload data
      loadData()
    } catch (error) {
      toast.error('Failed to complete reconciliation')
    } finally {
      setSubmitting(false)
    }
  }
  
  const adjustmentAmount = formData.expectedQuantity && formData.actualQuantity
    ? parseInt(formData.actualQuantity) - parseInt(formData.expectedQuantity)
    : 0
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="form" />
        <Loading type="table" />
      </div>
    )
  }
  
  if (error) {
    return <Error onRetry={loadData} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Monthly Reconciliation</h1>
        <p className="mt-2 text-gray-600">Verify physical inventory counts and adjust for discrepancies</p>
      </div>
      
      {/* Reconciliation Form */}
      <Card className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Inventory Reconciliation</h2>
          <p className="text-gray-600">Compare expected quantities with actual physical counts</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            type="select"
            label="Vaccine Lot"
            name="lotId"
            value={formData.lotId}
            onChange={handleFieldChange}
            options={vaccineLots}
            required
          />
          
          {selectedLot && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Lot Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Vaccine:</p>
                  <p className="font-medium">{selectedLot.vaccine}</p>
                </div>
                <div>
                  <p className="text-blue-700">Lot Number:</p>
                  <p className="font-medium">{selectedLot.lotNumber}</p>
                </div>
                <div>
                  <p className="text-blue-700">Expiration:</p>
                  <p className="font-medium">{format(new Date(selectedLot.expirationDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-blue-700">System Quantity:</p>
                  <p className="font-medium">{selectedLot.quantityOnHand} doses</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="number"
              label="Expected Quantity"
              name="expectedQuantity"
              value={formData.expectedQuantity}
              onChange={handleFieldChange}
              required
              disabled={!selectedLot}
            />
            <FormField
              type="number"
              label="Actual Physical Count"
              name="actualQuantity"
              value={formData.actualQuantity}
              onChange={handleFieldChange}
              required
              placeholder="Enter physical count"
            />
          </div>
          
          {adjustmentAmount !== 0 && (
            <div className={`p-4 rounded-lg border ${
              adjustmentAmount > 0 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={adjustmentAmount > 0 ? 'TrendingUp' : 'TrendingDown'} 
                  size={20}
                  className={adjustmentAmount > 0 ? 'text-green-600' : 'text-red-600'}
                />
                <span className={`font-semibold ${
                  adjustmentAmount > 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  Adjustment: {adjustmentAmount > 0 ? '+' : ''}{adjustmentAmount} doses
                </span>
              </div>
              <p className={`text-sm mt-1 ${
                adjustmentAmount > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {adjustmentAmount > 0 
                  ? 'Physical count is higher than expected' 
                  : 'Physical count is lower than expected'
                }
              </p>
            </div>
          )}
          
          <FormField
            type="select"
            label="Adjustment Reason"
            name="adjustmentReason"
            value={formData.adjustmentReason}
            onChange={handleFieldChange}
            options={adjustmentReasons}
            required={adjustmentAmount !== 0}
          />
          
          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>
              Complete Reconciliation
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Recent Reconciliations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Reconciliations</h2>
        
        {reconciliations.length === 0 ? (
          <Empty
            title="No reconciliations found"
            message="Start by completing your first inventory reconciliation"
            icon="Calculator"
          />
        ) : (
          <div className="space-y-4">
            {reconciliations.map((reconciliation) => (
              <motion.div
                key={reconciliation.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:shadow-lg transition-shadow"
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        reconciliation.adjustmentAmount === 0 
                          ? 'bg-success/10' 
                          : reconciliation.adjustmentAmount > 0 
                            ? 'bg-info/10' 
                            : 'bg-warning/10'
                      }`}>
                        <ApperIcon 
                          name={reconciliation.adjustmentAmount === 0 ? 'CheckCircle' : 'Calculator'} 
                          size={24} 
                          className={
                            reconciliation.adjustmentAmount === 0 
                              ? 'text-success' 
                              : reconciliation.adjustmentAmount > 0 
                                ? 'text-info' 
                                : 'text-warning'
                          } 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Lot #{reconciliation.lotId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reconciled on {format(new Date(reconciliation.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Expected</p>
                        <p className="font-semibold text-gray-900">{reconciliation.expectedQuantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Actual</p>
                        <p className="font-semibold text-gray-900">{reconciliation.actualQuantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Adjustment</p>
                        <p className={`font-semibold ${
                          reconciliation.adjustmentAmount === 0 
                            ? 'text-success' 
                            : reconciliation.adjustmentAmount > 0 
                              ? 'text-info' 
                              : 'text-warning'
                        }`}>
                          {reconciliation.adjustmentAmount > 0 ? '+' : ''}{reconciliation.adjustmentAmount}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          reconciliation.adjustmentAmount === 0 
                            ? 'success' 
                            : reconciliation.adjustmentAmount > 0 
                              ? 'info' 
                              : 'warning'
                        }
                      >
                        {reconciliation.adjustmentAmount === 0 ? 'Matched' : 'Adjusted'}
                      </Badge>
                    </div>
                  </div>
                  
                  {reconciliation.adjustmentReason && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                      <p className="text-sm text-gray-600">{reconciliation.adjustmentReason}</p>
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

export default Reconciliation