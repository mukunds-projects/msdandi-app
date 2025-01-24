'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '@/components/Notification';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary(null);
    
    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ gitHubUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ 
          message: 'Repository summary generated successfully', 
          type: 'success' 
        });
        setSummary(data.data);
      } else {
        setNotification({ 
          message: data.error || 'Failed to generate summary', 
          type: 'delete' 
        });
      }
    } catch (error) {
      setNotification({ 
        message: 'Error processing request', 
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

          <div>
            <label htmlFor="gitHubUrl" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository URL
            </label>
            <input
              id="gitHubUrl"
              type="url"
              value={gitHubUrl}
              onChange={(e) => setGitHubUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/username/repository"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-blue-600 text-white rounded-lg transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isLoading ? 'Processing...' : 'Generate Summary'}
          </button>
        </form>

        {summary && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Repository Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <p><span className="font-medium">Repository:</span> {summary.repository}</p>
              <p><span className="font-medium">Summary:</span> {summary.summary}</p>
              <div>
                <span className="font-medium">Main Technologies:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {summary.mainTechnologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <p><span className="font-medium">Total Files:</span> {summary.totalFiles}</p>
              <p><span className="font-medium">Total Commits:</span> {summary.totalCommits}</p>
              <p><span className="font-medium">Contributors:</span> {summary.contributors}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 