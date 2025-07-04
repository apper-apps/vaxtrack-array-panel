export const receiptService = {
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
          { field: { Name: "date_received" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "doses_passed" } },
          { field: { Name: "doses_failed" } },
          { field: { Name: "discrepancy_reason" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('receipt', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching receipts:", error)
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
          { field: { Name: "date_received" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "doses_passed" } },
          { field: { Name: "doses_failed" } },
          { field: { Name: "discrepancy_reason" } }
        ]
      }
      
      const response = await apperClient.getRecordById('receipt', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching receipt with ID ${id}:`, error)
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
          date_received: data.date_received,
          quantity_sent: data.quantity_sent,
          quantity_received: data.quantity_received,
          doses_passed: data.doses_passed,
          doses_failed: data.doses_failed,
          discrepancy_reason: data.discrepancy_reason
        }]
      }
      
      const response = await apperClient.createRecord('receipt', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create receipt')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating receipt:", error)
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
      if (data.date_received !== undefined) updateData.date_received = data.date_received
      if (data.quantity_sent !== undefined) updateData.quantity_sent = data.quantity_sent
      if (data.quantity_received !== undefined) updateData.quantity_received = data.quantity_received
      if (data.doses_passed !== undefined) updateData.doses_passed = data.doses_passed
      if (data.doses_failed !== undefined) updateData.doses_failed = data.doses_failed
      if (data.discrepancy_reason !== undefined) updateData.discrepancy_reason = data.discrepancy_reason
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('receipt', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update receipt')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating receipt:", error)
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
      
      const response = await apperClient.deleteRecord('receipt', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete receipt')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting receipt:", error)
      throw error
    }
  }
}