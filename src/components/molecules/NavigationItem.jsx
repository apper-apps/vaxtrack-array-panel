import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavigationItem = ({ 
  to, 
  icon, 
  label, 
  badge,
  className = '',
  onClick 
}) => {
  return (
    <NavLink 
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
        ${className}
      `}
    >
      {({ isActive }) => (
        <motion.div 
          className="flex items-center space-x-3 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon 
            name={icon} 
            size={20} 
            className={isActive ? 'text-white' : 'text-gray-500'}
          />
          <span className="font-medium">{label}</span>
          {badge && (
            <span className={`
              ml-auto px-2 py-1 text-xs font-bold rounded-full
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-error text-white'
              }
            `}>
              {badge}
            </span>
          )}
        </motion.div>
      )}
    </NavLink>
  )
}

export default NavigationItem