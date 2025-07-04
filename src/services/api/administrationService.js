export const administrationService = {
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
          { field: { Name: "date_administered" } },
          { field: { Name: "age_group" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "lot_id" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('administration', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching administrations:", error)
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
          { field: { Name: "date_administered" } },
          { field: { Name: "age_group" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "lot_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('administration', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching administration with ID ${id}:`, error)
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
          date_administered: data.date_administered,
          age_group: data.age_group,
          doses_administered: data.doses_administered,
          lot_id: data.lot_id
        }]
      }
      
      const response = await apperClient.createRecord('administration', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create administration')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating administration:", error)
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
      if (data.date_administered !== undefined) updateData.date_administered = data.date_administered
      if (data.age_group !== undefined) updateData.age_group = data.age_group
      if (data.doses_administered !== undefined) updateData.doses_administered = data.doses_administered
      if (data.lot_id !== undefined) updateData.lot_id = data.lot_id
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('administration', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update administration')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating administration:", error)
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
      
      const response = await apperClient.deleteRecord('administration', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete administration')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting administration:", error)
      throw error
    }
  }
}