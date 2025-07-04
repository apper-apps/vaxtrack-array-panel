export const reconciliationService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "lot_id" } },
          { field: { Name: "expected_quantity" } },
          { field: { Name: "actual_quantity" } },
          { field: { Name: "adjustment_reason" } },
          { field: { Name: "adjustment_amount" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('reconciliation', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching reconciliations:", error)
      throw error
    }
  },
  
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "lot_id" } },
          { field: { Name: "expected_quantity" } },
          { field: { Name: "actual_quantity" } },
          { field: { Name: "adjustment_reason" } },
          { field: { Name: "adjustment_amount" } }
        ]
      }
      
      const response = await apperClient.getRecordById('reconciliation', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching reconciliation with ID ${id}:`, error)
      throw error
    }
  },
  
  async create(data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: data.Name,
          Tags: data.Tags,
          Owner: data.Owner,
          date: data.date,
          lot_id: data.lot_id,
          expected_quantity: data.expected_quantity,
          actual_quantity: data.actual_quantity,
          adjustment_reason: data.adjustment_reason,
          adjustment_amount: data.adjustment_amount
        }]
      }
      
      const response = await apperClient.createRecord('reconciliation', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create reconciliation')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating reconciliation:", error)
      throw error
    }
  },
  
  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = { Id: parseInt(id) }
      if (data.Name !== undefined) updateData.Name = data.Name
      if (data.Tags !== undefined) updateData.Tags = data.Tags
      if (data.Owner !== undefined) updateData.Owner = data.Owner
      if (data.date !== undefined) updateData.date = data.date
      if (data.lot_id !== undefined) updateData.lot_id = data.lot_id
      if (data.expected_quantity !== undefined) updateData.expected_quantity = data.expected_quantity
      if (data.actual_quantity !== undefined) updateData.actual_quantity = data.actual_quantity
      if (data.adjustment_reason !== undefined) updateData.adjustment_reason = data.adjustment_reason
      if (data.adjustment_amount !== undefined) updateData.adjustment_amount = data.adjustment_amount
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('reconciliation', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update reconciliation')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating reconciliation:", error)
      throw error
    }
  },
  
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('reconciliation', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete reconciliation')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting reconciliation:", error)
      throw error
    }
  }
}