import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'input',
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder,
  icon,
  className = '',
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value)
    }
  }
  
  if (type === 'select') {
    return (
      <div className={className}>
        <Select
          label={label}
          value={value}
          onChange={handleChange}
          options={options}
          error={error}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      </div>
    )
  }
  
  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={handleChange}
        error={error}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        icon={icon}
        {...props}
      />
    </div>
  )
}

export default FormField