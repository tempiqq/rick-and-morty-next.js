import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-lg font-medium">
        Page {currentPage} {totalPages && `of ${totalPages}`}
      </span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};
