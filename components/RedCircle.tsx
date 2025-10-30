interface RedCircleProps {
  size: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const RedCircle = ({ size, className }: RedCircleProps) => {
  const tagSizes = {
    xs: "size-2",
    sm: "size-2.5",
    md: "size-3",
    lg: "size-4"
  };

  return (
    <div className={`${tagSizes[size]} bg-black relative ${className}`} style={{
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
    }}>
      <div className="absolute inset-px bg-red-200" style={{
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
      }}>
        <div className="absolute inset-px bg-red-600" style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }} />
      </div>
      <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-[2px] bg-red-900 z-10" />
    </div>
  );
};