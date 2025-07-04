import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  value,
  onChange,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }
  
  const handleChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          icon="Search"
          iconPosition="left"
        />
      </div>
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  )
}

export default SearchBar