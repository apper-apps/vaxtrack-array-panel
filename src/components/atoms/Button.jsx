import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-primary/50 hover:scale-105 active:scale-95",
    secondary: "bg-white text-gray-900 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-primary/50 hover:scale-105 active:scale-95",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl focus:ring-error/50 hover:scale-105 active:scale-95",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-lg hover:shadow-xl focus:ring-success/50 hover:scale-105 active:scale-95",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/50"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const iconSizeClasses = {
    sm: 16,
    md: 18,
    lg: 20
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  const iconSize = iconSizeClasses[size]
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSize} 
          className="animate-spin mr-2" 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="mr-2" 
        />
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSize} 
          className="ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button