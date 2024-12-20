'use client';
import { useState, useEffect } from 'react';
import { apiKeyService } from '@/services/apiKeyService';
import CurrentPlan from '@/components/dashboard/CurrentPlan';
import ApiKeyModal from '@/components/dashboard/ApiKeyModal';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';
import Notification from '@/components/Notification';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [limitMonthlyUsage, setLimitMonthlyUsage] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [editingKey, setEditingKey] = useState(null);

  // Fetch API keys on component mount
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const data = await apiKeyService.fetchApiKeys();
        setApiKeys(data.map(key => ({ ...key, isVisible: false })));
      } catch (err) {
        setError('Failed to fetch API keys: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeys();
  }, []);

  // Helper functions
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const maskApiKey = (key) => {
    const prefix = key.slice(0, 7);
    const masked = '*'.repeat(32);
    return `${prefix}${masked}`;
  };

  const generateRandomString = (length) => {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  };

  // Handlers
  const handleCreateKey = async (data) => {
    try {
      const newKey = {
        name: data.name,
        key: `pk_live_${generateRandomString(32)}`,
        description: data.description || null,
        monthly_limit: limitMonthlyUsage ? parseInt(monthlyLimit) : null,
        usage: 0,
        created_at: new Date().toISOString(),
        last_used_at: null
      };

      const createdKey = await apiKeyService.createApiKey(newKey);
      setApiKeys([{ ...createdKey, isVisible: false }, ...apiKeys]);
      setShowModal(false);
      resetForm();
      showNotification('API key created successfully');
    } catch (err) {
      setError('Failed to create API key: ' + err.message);
    }
  };

  const handleUpdateKey = async (id, data) => {
    try {
      const updateData = {
        name: data.name,
        description: data.description || null,
        monthly_limit: limitMonthlyUsage ? parseInt(monthlyLimit) : null,
      };

      const updatedKey = await apiKeyService.updateApiKey(id, updateData);
      setApiKeys(apiKeys.map(key => 
        key.id === id 
          ? { ...updatedKey, isVisible: key.isVisible }
          : key
      ));
      setShowModal(false);
      setEditingKey(null);
      resetForm();
      showNotification('API key updated successfully', 'edit');
    } catch (err) {
      setError('Failed to update API key: ' + err.message);
    }
  };

  const handleViewKey = (apiKey) => {
    const updatedKeys = apiKeys.map(key => ({
      ...key,
      isVisible: key.id === apiKey.id ? !key.isVisible : key.isVisible
    }));
    setApiKeys(updatedKeys);
  };

  const handleCopyKey = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      await apiKeyService.updateLastUsed(id);
      showNotification('Copied API Key to clipboard');
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleEditKey = (apiKey) => {
    setEditingKey(apiKey);
    setFormData({
      name: apiKey.name,
      description: apiKey.description || '',
    });
    setLimitMonthlyUsage(!!apiKey.monthly_limit);
    if (apiKey.monthly_limit) {
      setMonthlyLimit(apiKey.monthly_limit.toString());
    }
    setShowModal(true);
  };

  const handleDeleteKey = async (id) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      showNotification('API key deleted successfully', 'delete');
    } catch (err) {
      setError('Failed to delete API key');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setLimitMonthlyUsage(false);
    setMonthlyLimit('1000');
    setEditingKey(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingKey) {
      await handleUpdateKey(editingKey.id, formData);
    } else {
      await handleCreateKey(formData);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-8 ml-64">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)} 
        />
      )}

      <CurrentPlan />

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">API Keys</h2>
            <p className="text-gray-600 text-sm">
              The key is used to authenticate your requests to the Research API. 
              To learn more, see the documentation page.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span>+</span>
            <span>New Key</span>
          </button>
        </div>

        <ApiKeysTable 
          apiKeys={apiKeys}
          onView={handleViewKey}
          onCopy={handleCopyKey}
          onEdit={handleEditKey}
          onDelete={handleDeleteKey}
          maskApiKey={maskApiKey}
        />
      </div>

      <ApiKeyModal 
        showModal={showModal}
        editingKey={editingKey}
        formData={formData}
        limitMonthlyUsage={limitMonthlyUsage}
        monthlyLimit={monthlyLimit}
        onClose={() => {
          setShowModal(false);
          setEditingKey(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        onChange={setFormData}
        onLimitChange={setLimitMonthlyUsage}
        onMonthlyLimitChange={setMonthlyLimit}
      />
    </div>
  );
} 