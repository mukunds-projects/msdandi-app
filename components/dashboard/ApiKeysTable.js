'use client';
import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ApiKeysTable({ 
  apiKeys, 
  onView, 
  onCopy, 
  onEdit, 
  onDelete,
  maskApiKey 
}) {
  return (
    <div className="mt-6">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-4 font-medium">NAME</th>
            <th className="pb-4 font-medium">USAGE</th>
            <th className="pb-4 font-medium">KEY</th>
            <th className="pb-4 font-medium text-right">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((apiKey) => (
            <tr key={apiKey.id} className="border-b">
              <td className="py-4">{apiKey.name}</td>
              <td className="py-4">{apiKey.usage || 0}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-gray-50 px-3 py-1 rounded">
                    {apiKey.isVisible ? apiKey.key : maskApiKey(apiKey.key)}
                  </code>
                </div>
              </td>
              <td className="py-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onView(apiKey)}
                    className={`p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 
                      ${apiKey.isVisible ? 'bg-gray-100' : ''}`}
                    aria-label={apiKey.isVisible ? "Hide API Key" : "View API Key"}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onCopy(apiKey.key, apiKey.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    aria-label="Copy API Key"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(apiKey)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    aria-label="Edit API Key"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(apiKey.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                    aria-label="Delete API Key"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 