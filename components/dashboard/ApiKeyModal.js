'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

export default function ApiKeyModal({ 
  showModal, 
  editingKey, 
  formData, 
  limitMonthlyUsage,
  monthlyLimit,
  onClose,
  onSubmit,
  onChange,
  onLimitChange,
  onMonthlyLimitChange 
}) {
  if (!showModal) return null;

  useEffect(() => {
    if (showModal) {
      const inputElement = document.getElementById('keyNameInput');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [showModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editingKey ? 'Edit API key' : 'Create a new API key'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          {editingKey 
            ? 'Update the API key details.'
            : 'Enter a name and limit for the new API key.'}
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="keyNameInput" className="block text-sm font-medium text-gray-700 mb-1">
              Key Name — A unique name to identify this key
            </label>
            <input
              id="keyNameInput"
              type="text"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Key Name"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="descriptionInput" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <input
              id="descriptionInput"
              type="text"
              value={formData.description || ''}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={limitMonthlyUsage}
                onChange={(e) => onLimitChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Limit monthly usage*
              </span>
            </label>
            {limitMonthlyUsage && (
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => onMonthlyLimitChange(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            )}
          </div>

          <p className="text-xs text-gray-500">
            * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingKey ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 