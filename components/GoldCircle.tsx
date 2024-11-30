interface GoldCircleProps {
  size: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const GoldCircle = ({ size, className }: GoldCircleProps) => {
  const tagSizes = {
    xs: "size-[0.5rem]",
    sm: "size-2.5",
    md: "size-3",
    lg: "size-4"
  };

  return (
    <div className={`${tagSizes[size]} bg-black relative ${className}`} style={{
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
    }}>
      <div className="absolute inset-[1px] bg-yellow-200" style={{
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
      }}>
        <div className="absolute inset-[1px] bg-yellow-600" style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }} />
      </div>
      <div className="absolute top-[calc(50%-1px)] left-0 right-0 h-[2px] bg-yellow-900 z-10" />
    </div>
  );
};