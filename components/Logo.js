export default function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        className="w-8 h-8 text-blue-600"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill="currentColor"
        />
        <path
          d="M2 17L12 22L22 17M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {!collapsed && <span className="text-xl font-bold text-gray-800">MS Dandi</span>}
    </div>
  );
} 