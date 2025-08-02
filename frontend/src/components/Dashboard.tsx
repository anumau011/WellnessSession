import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sessionsAPI } from '../lib/api';
import type { Session } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const params = filter !== 'all' ? { status: filter } : undefined;
      const response = await sessionsAPI.getMySessions(params);
      setSessions(response.sessions);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await sessionsAPI.deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session._id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete session');
    }
  };

  const handlePublishSession = async (sessionId: string) => {
    try {
      await sessionsAPI.publishSession(sessionId);
      // Reload sessions to get updated status
      loadSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish session');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'published') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      yoga: 'bg-purple-100 text-purple-800',
      meditation: 'bg-blue-100 text-blue-800',
      breathing: 'bg-green-100 text-green-800',
      mindfulness: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[category] || colors.other}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/sessions/new"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create New Session
              </Link>
              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Sessions' },
                { key: 'draft', label: 'Drafts' },
                { key: 'published', label: 'Published' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sessions found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't created any wellness sessions yet."
                  : `You don't have any ${filter} sessions.`
                }
              </p>
              <Link
                to="/sessions/new"
                className="btn-primary"
              >
                Create Your First Session
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session._id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {session.title}
                  </h3>
                  <div className="flex space-x-1">
                    <span className={getStatusBadge(session.status)}>
                      {session.status}
                    </span>
                  </div>
                </div>

                {session.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {session.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={getCategoryBadge(session.category)}>
                    {session.category}
                  </span>
                  {session.difficulty && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {session.difficulty}
                    </span>
                  )}
                  {session.duration && session.duration > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {session.duration} min
                    </span>
                  )}
                </div>

                {session.tags && session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {session.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                        +{session.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Last saved: {formatDate(session.lastSaved)}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link
                      to={`/sessions/${session._id}/edit`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/sessions/${session._id}`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                  
                  <div className="flex space-x-2">
                    {session.status === 'draft' && (
                      <button
                        onClick={() => handlePublishSession(session._id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
