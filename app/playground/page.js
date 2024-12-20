'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '@/components/Notification';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (data.valid) {
        setNotification({ 
          message: `Valid API Key: ${data.keyData.name} (${data.keyData.usage}/${data.keyData.monthly_limit || '∞'} requests)`, 
          type: 'success' 
        });
        
        // Store the API key data in session storage for the protected route
        sessionStorage.setItem('apiKeyData', JSON.stringify(data.keyData));
        
        setTimeout(() => {
          router.push('/protected');
        }, 2000);
      } else {
        setNotification({ 
          message: data.message || 'Invalid API Key', 
          type: 'delete' 
        });
      }
    } catch (error) {
      setNotification({ 
        message: 'Error validating API key', 
        type: 'delete' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">API Playground</h1>
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="pk_live_..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-blue-600 text-white rounded-lg transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isLoading ? 'Validating...' : 'Validate Key'}
          </button>
        </form>
      </div>
    </div>
  );
} 