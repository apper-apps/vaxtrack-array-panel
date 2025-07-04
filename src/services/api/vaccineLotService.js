export const vaccineLotService = {
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
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "date_received" } },
          { field: { Name: "vaccine_id" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('vaccine_lot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching vaccine lots:", error)
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
          { field: { Name: "lot_number" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "date_received" } },
          { field: { Name: "vaccine_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('vaccine_lot', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching vaccine lot with ID ${id}:`, error)
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
          lot_number: data.lot_number,
          expiration_date: data.expiration_date,
          quantity_received: data.quantity_received,
          quantity_on_hand: data.quantity_on_hand,
          date_received: data.date_received,
          vaccine_id: data.vaccine_id
        }]
      }
      
      const response = await apperClient.createRecord('vaccine_lot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create vaccine lot')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating vaccine lot:", error)
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
      if (data.lot_number !== undefined) updateData.lot_number = data.lot_number
      if (data.expiration_date !== undefined) updateData.expiration_date = data.expiration_date
      if (data.quantity_received !== undefined) updateData.quantity_received = data.quantity_received
      if (data.quantity_on_hand !== undefined) updateData.quantity_on_hand = data.quantity_on_hand
      if (data.date_received !== undefined) updateData.date_received = data.date_received
      if (data.vaccine_id !== undefined) updateData.vaccine_id = data.vaccine_id
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('vaccine_lot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update vaccine lot')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating vaccine lot:", error)
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
      
      const response = await apperClient.deleteRecord('vaccine_lot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete vaccine lot')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting vaccine lot:", error)
      throw error
    }
  }
}