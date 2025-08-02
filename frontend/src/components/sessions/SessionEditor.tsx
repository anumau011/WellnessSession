import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionsAPI } from '../../lib/api';
import type { Session } from '../../types';
import AutoSaveIndicator from './AutoSaveIndicator';

const SessionEditor: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(paramId);

  // Store session ID here (initially from params, or after creating new draft)
  const [sessionId, setSessionId] = useState<string | undefined>(paramId);

  const [session, setSession] = useState<Partial<Session>>({
    title: '',
    description: '',
    tags: [],
    jsonUrl: '',
    category: 'meditation',
    difficulty: 'beginner',
    duration: 30,
    status: 'draft',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load existing session if editing
  useEffect(() => {
    if (isEditing && paramId) {
      const loadSession = async () => {
        try {
          setLoading(true);
          const data = await sessionsAPI.getSession(paramId);
          setSession(data);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load session');
        } finally {
          setLoading(false);
        }
      };
      loadSession();
    }
  }, [isEditing, paramId]);

  // Auto-save state and debounce ref
  const [autoSaveStatus, setAutoSaveStatus] = useState<any>({ status: 'idle' });
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save on page unload/navigation
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Save draft before closing/navigating away
      if (session.title?.trim()) {
        try {
          await saveSession({ ...session, status: 'draft' });
        } catch (error) {
          console.error('Failed to auto-save before unload:', error);
        }
      }
    };

    const handleUnload = async () => {
      // Final attempt to save on unload
      if (session.title?.trim()) {
        try {
          // Use navigator.sendBeacon for reliable saving during unload
          const data = JSON.stringify({ ...session, status: 'draft' });
          const token = localStorage.getItem('wellness_token');
          
          if (token && sessionId) {
            navigator.sendBeacon(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sessions/${sessionId}`,
              new Blob([data], { type: 'application/json' })
            );
          }
        } catch (error) {
          console.error('Failed to auto-save on unload:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      
      // Clear any pending debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [session, sessionId]);

  // Auto-save when navigating away using React Router
  useEffect(() => {
    const handleNavigation = () => {
      if (session.title?.trim()) {
        // Trigger immediate save before navigation
        saveSession({ ...session, status: 'draft' }).catch(error => {
          console.error('Failed to auto-save before navigation:', error);
        });
      }
    };

    // This will run when component unmounts (navigation)
    return handleNavigation;
  }, [session, sessionId]);

  // Periodic auto-save every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // Only auto-save if:
      // 1. Has a title (valid content)
      // 2. Not currently saving
      // 3. No recent error (to prevent spam)
      if (
        session.title?.trim() && 
        autoSaveStatus.status !== 'saving' && 
        autoSaveStatus.status !== 'error'
      ) {
        try {
          setAutoSaveStatus({ status: 'saving' });
          await saveSession({ ...session, status: 'draft' });
          setAutoSaveStatus({ status: 'saved', lastSaved: new Date() });
          
          setTimeout(() => {
            setAutoSaveStatus((prev: any) => ({ ...prev, status: 'idle' }));
          }, 2000);
        } catch (error) {
          console.error('Periodic auto-save failed:', error);
          setAutoSaveStatus({ status: 'error', error: 'Auto-save failed' });
          
          // Reset error status after 10 seconds to allow retry
          setTimeout(() => {
            setAutoSaveStatus((prev: any) => ({ ...prev, status: 'idle' }));
          }, 10000);
        }
      }
    }, 5000); // 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [session, sessionId, autoSaveStatus.status]);

  // Save session (create new or update existing)
  const saveSession = async (sessionData: Partial<Session>) => {
    if (!sessionData.title?.trim()) {
      // Skip saving if no title
      return;
    }

    try {
      let response;
      if (sessionId) {
        // Update existing session - clean the data first
        const cleanData = { ...sessionData };
        if (!cleanData.jsonUrl?.trim()) {
          delete cleanData.jsonUrl;
        }
        response = await sessionsAPI.updateSession(sessionId, cleanData);
      } else {
        // Create new draft session - clean the data first
        const createData: any = {
          title: sessionData.title,
          description: sessionData.description || '',
          tags: sessionData.tags || [],
          category: sessionData.category || 'meditation',
          difficulty: sessionData.difficulty || 'beginner',
          duration: sessionData.duration || 30,
          status: 'draft' as const,
        };
        
        // Only include jsonUrl if it's not empty
        if (sessionData.jsonUrl?.trim()) {
          createData.jsonUrl = sessionData.jsonUrl;
        }
        
        console.log('Creating session with data:', createData);
        response = await sessionsAPI.createSession(createData);
        console.log('Session created successfully:', response);
        
        // Store the session ID from the response
        if (response.session?._id) {
          setSessionId(response.session._id);
        } else if (response._id) {
          setSessionId(response._id);
        }
      }
      return response;
    } catch (error: any) {
      console.error('Auto-save error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Session data that failed:', sessionData);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred during auto-save';

      setAutoSaveStatus({ status: 'error', error: message });

      throw error;
    }
  };

  // Debounced auto-save trigger (5s delay)
  const triggerSave = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (session.title?.trim()) {
        try {
          setAutoSaveStatus({ status: 'saving' });
          await saveSession(session);
          setAutoSaveStatus({ status: 'saved', lastSaved: new Date() });

          setTimeout(() => {
            setAutoSaveStatus((prev: any) => ({ ...prev, status: 'idle' }));
          }, 2000);
        } catch (error) {
          // autoSaveStatus error already set in saveSession catch block
        }
      }
    }, 5000);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setSession(prev => ({
      ...prev,
      [field]: value,
    }));
    triggerSave();
  };

  // Handle tags input (comma-separated)
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setSession(prev => ({
      ...prev,
      tags,
    }));
    triggerSave();
  };

  // Publish session (set status published)
  const handlePublish = async () => {
    if (!session.title?.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const sessionToPublish = {
        ...session,
        status: 'published' as const,
      };

      if (!sessionToPublish.jsonUrl?.trim()) {
        delete sessionToPublish.jsonUrl;
      }

      if (sessionId) {
        await sessionsAPI.updateSession(sessionId, sessionToPublish);
      } else {
        const createData = {
          title: sessionToPublish.title!,
          description: sessionToPublish.description,
          tags: sessionToPublish.tags,
          jsonUrl: sessionToPublish.jsonUrl,
          category: sessionToPublish.category,
          difficulty: sessionToPublish.difficulty,
          duration: sessionToPublish.duration,
          status: sessionToPublish.status,
        };
        await sessionsAPI.createSession(createData);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Publish error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to publish session';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const errorDetails = validationErrors.map((e: any) => e.msg || e.message).join(', ');
        setError(`${errorMessage}: ${errorDetails}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save as draft (status draft)
  const handleSaveDraft = async () => {
    if (!session.title?.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const sessionToDraft = {
        ...session,
        status: 'draft' as const,
      };

      if (!sessionToDraft.jsonUrl?.trim()) {
        delete sessionToDraft.jsonUrl;
      }

      if (sessionId) {
        await sessionsAPI.updateSession(sessionId, sessionToDraft);
      } else {
        const createData = {
          title: sessionToDraft.title!,
          description: sessionToDraft.description,
          tags: sessionToDraft.tags,
          jsonUrl: sessionToDraft.jsonUrl,
          category: sessionToDraft.category,
          difficulty: sessionToDraft.difficulty,
          duration: sessionToDraft.duration,
          status: sessionToDraft.status,
        };
        await sessionsAPI.createSession(createData);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Save draft error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save draft';
      const validationErrors = err.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        const errorDetails = validationErrors.map((e: any) => e.msg || e.message).join(', ');
        setError(`${errorMessage}: ${errorDetails}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Session' : 'Create New Session'}
            </h1>
            <AutoSaveIndicator status={autoSaveStatus} />
          </div>

          <form className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={session.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter session title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={session.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your wellness session"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={session.category || 'meditation'}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="meditation">Meditation</option>
                <option value="yoga">Yoga</option>
                <option value="breathing">Breathing</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={session.difficulty || 'beginner'}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={session.duration || 30}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                max="180"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={session.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas (e.g., relaxation, stress-relief, evening)
              </p>
            </div>

            {/* JSON URL */}
            <div>
              <label htmlFor="jsonUrl" className="block text-sm font-medium text-gray-700">
                Content URL (Optional)
              </label>
              <input
                type="url"
                id="jsonUrl"
                value={session.jsonUrl || ''}
                onChange={(e) => handleInputChange('jsonUrl', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/session-content.json"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL to additional session content or resources
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Draft'}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
