"use client";

interface GradientButtonProps {
  children?: React.ReactNode;
}

const OutlineBorderButton = ({ children }: GradientButtonProps) => {
  return (
    <button className="relative overflow-hidden rounded-full bg-transparent px-6 py-2 text-white font-medium border border-gray-100">
      <div className="h-4 relative z-10 flex items-center gap-2 text-xs font-semibold text-black">
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </button>
  );
};

export default OutlineBorderButton;
