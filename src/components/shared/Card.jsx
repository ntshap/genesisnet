import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  onClick = null 
}) => {
  const baseClasses = 'transition-all duration-300';
  
  const variants = {
    default: 'glass-card',
    glass: 'glass',
    'glass-dark': 'glass-dark',
    primary: 'bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30',
    secondary: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
  };

  const hoverEffects = hover ? 'hover:scale-105 hover:shadow-glow cursor-pointer' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  const cardClasses = `${baseClasses} ${variants[variant]} ${hoverEffects} ${clickable} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;