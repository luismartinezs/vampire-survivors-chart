import React from "react";

export const EvolutionList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap justify-center gap-[0.30rem] sm:gap-1 lg:gap-2">
      {children}
    </div>
  );
};
