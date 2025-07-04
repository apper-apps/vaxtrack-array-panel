import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-semibold rounded-full transition-all duration-200"
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-lg",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white shadow-lg",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg",
    info: "bg-gradient-to-r from-info to-blue-600 text-white shadow-lg"
  }
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  const iconSizeClasses = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <span className={classes} {...props}>
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizeClasses[size]} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  )
}

export default Badge