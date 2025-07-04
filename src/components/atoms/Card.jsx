import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'md',
  gradient = false,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl border border-gray-200 transition-all duration-200"
  
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  }
  
  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl",
    xl: "shadow-xl hover:shadow-2xl"
  }
  
  const gradientClasses = gradient ? "bg-gradient-to-br from-white to-gray-50" : ""
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${gradientClasses} ${className}`
  
  if (hover) {
    return (
      <motion.div
        className={classes}
        whileHover={{ 
          scale: 1.02,
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card