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
import { administrationService } from '@/services/api/administrationService'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { format } from 'date-fns'

const Administration = () => {
  const [formData, setFormData] = useState({
    lotId: '',
    ageGroup: '',
    dosesAdministered: ''
  })
  const [vaccineLots, setVaccineLots] = useState([])
  const [administrations, setAdministrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const ageGroups = [
    { value: '0-6m', label: '0-6 months' },
    { value: '6-12m', label: '6-12 months' },
    { value: '1-2y', label: '1-2 years' },
    { value: '2-5y', label: '2-5 years' },
    { value: '5-12y', label: '5-12 years' },
    { value: '12-18y', label: '12-18 years' },
    { value: '18+y', label: '18+ years' }
  ]
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [lotsData, administrationsData] = await Promise.all([
        vaccineLotService.getAll(),
        administrationService.getAll()
      ])
      
      // Filter out lots with no remaining quantity
      const availableLots = lotsData.filter(lot => lot.quantityOnHand > 0)
      setVaccineLots(availableLots.map(lot => ({
        value: lot.Id,
        label: `${lot.vaccine} - Lot ${lot.lotNumber} (${lot.quantityOnHand} available)`
      })))
      
      setAdministrations(administrationsData)
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
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const doses = parseInt(formData.dosesAdministered)
      if (doses <= 0) {
        toast.error('Please enter a valid number of doses')
        return
      }
      
      // Check if lot has enough doses
      const lot = await vaccineLotService.getById(parseInt(formData.lotId))
      if (lot.quantityOnHand < doses) {
        toast.error('Not enough doses available in this lot')
        return
      }
      
      // Create administration record
      const administrationData = {
        lotId: parseInt(formData.lotId),
        dateAdministered: new Date().toISOString().split('T')[0],
        ageGroup: formData.ageGroup,
        dosesAdministered: doses
      }
      
      await administrationService.create(administrationData)
      
      // Update lot quantity
      await vaccineLotService.update(parseInt(formData.lotId), {
        quantityOnHand: lot.quantityOnHand - doses
      })
      
      toast.success('Doses administered successfully!')
      
      // Reset form
      setFormData({
        lotId: '',
        ageGroup: '',
        dosesAdministered: ''
      })
      
      // Reload data
      loadData()
    } catch (error) {
      toast.error('Failed to record administered doses')
    } finally {
      setSubmitting(false)
    }
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
    return <Error onRetry={loadData} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dose Administration</h1>
        <p className="mt-2 text-gray-600">Record administered vaccine doses by age group and lot</p>
      </div>
      
      {/* Administration Form */}
      <Card className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Record Administered Doses</h2>
          <p className="text-gray-600">Select the vaccine lot and enter the number of doses administered</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="select"
              label="Vaccine Lot"
              name="lotId"
              value={formData.lotId}
              onChange={handleFieldChange}
              options={vaccineLots}
              required
            />
            <FormField
              type="select"
              label="Age Group"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleFieldChange}
              options={ageGroups}
              required
            />
            <FormField
              type="number"
              label="Doses Administered"
              name="dosesAdministered"
              value={formData.dosesAdministered}
              onChange={handleFieldChange}
              required
              min="1"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>
              Record Administration
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Recent Administrations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Administrations</h2>
        
        {administrations.length === 0 ? (
          <Empty
            title="No administrations recorded"
            message="Start by recording your first vaccine administration"
            icon="Syringe"
          />
        ) : (
          <div className="space-y-4">
            {administrations.map((admin) => (
              <motion.div
                key={admin.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:shadow-lg transition-shadow"
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-success/10 rounded-lg">
                        <ApperIcon name="Syringe" size={24} className="text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Lot #{admin.lotId} - {admin.ageGroup}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Administered on {format(new Date(admin.dateAdministered), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Doses Given</p>
                        <p className="text-2xl font-bold text-success">{admin.dosesAdministered}</p>
                      </div>
                      <Badge variant="success" icon="CheckCircle">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Administration