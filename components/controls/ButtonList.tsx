interface ButtonListProps {
  children: React.ReactNode;
}

export function ButtonList({ children }: ButtonListProps) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center items-stretch">
      {children}
    </div>
  );
}