const LoadingSpinner = ({ size = 'md' }) => {
  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',      
    md: 'h-8 w-8',      
    lg: 'h-12 w-12',    
    xl: 'h-16 w-16',    
  };
  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-primary`}
      />
    </div>
  );
};
export default LoadingSpinner;