export default function Protected() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Protected Route</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <p className="text-gray-600">
          This is a protected route that can only be accessed with a valid API key.
        </p>
      </div>
    </div>
  );
} 