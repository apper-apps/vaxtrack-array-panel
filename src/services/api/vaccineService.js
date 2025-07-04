export const vaccineService = {
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
          { field: { Name: "family" } },
          { field: { Name: "manufacturer" } },
          { field: { Name: "doses_per_vial" } },
          { field: { Name: "storage_requirements" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('vaccine', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching vaccines:", error)
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
          { field: { Name: "family" } },
          { field: { Name: "manufacturer" } },
          { field: { Name: "doses_per_vial" } },
          { field: { Name: "storage_requirements" } }
        ]
      }
      
      const response = await apperClient.getRecordById('vaccine', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching vaccine with ID ${id}:`, error)
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
          family: data.family,
          manufacturer: data.manufacturer,
          doses_per_vial: data.doses_per_vial,
          storage_requirements: data.storage_requirements
        }]
      }
      
      const response = await apperClient.createRecord('vaccine', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create vaccine')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating vaccine:", error)
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
      if (data.family !== undefined) updateData.family = data.family
      if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer
      if (data.doses_per_vial !== undefined) updateData.doses_per_vial = data.doses_per_vial
      if (data.storage_requirements !== undefined) updateData.storage_requirements = data.storage_requirements
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('vaccine', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update vaccine')
        }
        
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error("Error updating vaccine:", error)
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
      
      const response = await apperClient.deleteRecord('vaccine', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete vaccine')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting vaccine:", error)
      throw error
    }
  }
}