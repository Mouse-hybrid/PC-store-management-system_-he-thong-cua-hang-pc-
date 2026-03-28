export const ProductSkeleton = () => {
  return (
    <div className="relative w-[234px] h-80 bg-gray-00 rounded-[3px] overflow-hidden border border-solid border-gray-100 animate-pulse">
      <div className="absolute top-4 left-4 w-[202px] h-[172px] bg-gray-100 rounded" />
      <div className="absolute top-[212px] left-4 right-4 inline-flex flex-col gap-2">
        <div className="w-24 h-3 bg-gray-100 rounded" />
        <div className="w-[170px] h-4 bg-gray-100 rounded" />
        <div className="w-20 h-4 bg-gray-100 rounded" />
      </div>
    </div>
  );
};
