import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { vaccineService } from '@/services/api/vaccineService'
import { receiptService } from '@/services/api/receiptService'
import { vaccineLotService } from '@/services/api/vaccineLotService'

const VaccineReceivingForm = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vaccine: '',
    lotNumber: '',
    expirationDate: '',
    quantitySent: '',
    quantityReceived: '',
    dosesPassed: '',
    dosesFailed: '',
    discrepancyReason: ''
  })
  const [loading, setLoading] = useState(false)
  const [vaccines, setVaccines] = useState([])
  
  useState(() => {
    const loadVaccines = async () => {
      try {
        const data = await vaccineService.getAll()
        setVaccines(data.map(v => ({ value: v.Id, label: v.name })))
      } catch (error) {
        toast.error('Failed to load vaccines')
      }
    }
    loadVaccines()
  }, [])
  
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create vaccine lot
      const lotData = {
        vaccineId: formData.vaccine,
        lotNumber: formData.lotNumber,
        expirationDate: formData.expirationDate,
        quantityReceived: parseInt(formData.quantityReceived),
        quantityOnHand: parseInt(formData.dosesPassed),
        dateReceived: new Date().toISOString().split('T')[0]
      }
      
      const newLot = await vaccineLotService.create(lotData)
      
      // Create receipt record
      const receiptData = {
        dateReceived: new Date().toISOString().split('T')[0],
        lots: [newLot],
        quantitySent: parseInt(formData.quantitySent),
        quantityReceived: parseInt(formData.quantityReceived),
        dosesPassed: parseInt(formData.dosesPassed),
        dosesFailed: parseInt(formData.dosesFailed),
        discrepancyReason: formData.discrepancyReason
      }
      
      await receiptService.create(receiptData)
      
      toast.success('Vaccine shipment received successfully!')
      
      // Reset form
      setFormData({
        vaccine: '',
        lotNumber: '',
        expirationDate: '',
        quantitySent: '',
        quantityReceived: '',
        dosesPassed: '',
        dosesFailed: '',
        discrepancyReason: ''
      })
      setCurrentStep(1)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast.error('Failed to process vaccine shipment')
    } finally {
      setLoading(false)
    }
  }
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))
  
  const steps = [
    { id: 1, title: 'Vaccine Details', icon: 'Package' },
    { id: 2, title: 'Quantities', icon: 'Hash' },
    { id: 3, title: 'Inspection', icon: 'CheckCircle' }
  ]
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Receive Vaccine Shipment</h2>
        <p className="text-gray-600">Record incoming vaccine shipments and inspection results</p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
              ${currentStep >= step.id 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 text-gray-400'
              }
            `}>
              {currentStep > step.id ? (
                <ApperIcon name="Check" size={16} />
              ) : (
                <ApperIcon name={step.icon} size={16} />
              )}
            </div>
            <div className={`ml-3 ${index < steps.length - 1 ? 'mr-8' : ''}`}>
              <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="select"
                  label="Vaccine"
                  name="vaccine"
                  value={formData.vaccine}
                  onChange={handleFieldChange}
                  options={vaccines}
                  required
                />
                <FormField
                  type="text"
                  label="Lot Number"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleFieldChange}
                  required
                />
                <FormField
                  type="date"
                  label="Expiration Date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleFieldChange}
                  required
                />
              </div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="number"
                  label="Quantity Sent"
                  name="quantitySent"
                  value={formData.quantitySent}
                  onChange={handleFieldChange}
                  required
                />
                <FormField
                  type="number"
                  label="Quantity Received"
                  name="quantityReceived"
                  value={formData.quantityReceived}
                  onChange={handleFieldChange}
                  required
                />
              </div>
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="number"
                  label="Doses Passed Inspection"
                  name="dosesPassed"
                  value={formData.dosesPassed}
                  onChange={handleFieldChange}
                  required
                />
                <FormField
                  type="number"
                  label="Doses Failed Inspection"
                  name="dosesFailed"
                  value={formData.dosesFailed}
                  onChange={handleFieldChange}
                  required
                />
              </div>
              <FormField
                type="text"
                label="Discrepancy Reason"
                name="discrepancyReason"
                value={formData.discrepancyReason}
                onChange={handleFieldChange}
                placeholder="Describe any discrepancies or issues found"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex space-x-4">
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" loading={loading}>
                Complete Receiving
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  )
}

export default VaccineReceivingForm