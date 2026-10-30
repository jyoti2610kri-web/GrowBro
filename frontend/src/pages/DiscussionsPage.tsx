
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ThumbsUp,
  Plus,
  Search,
  Filter,
  MessageCircle,
  X
} from 'lucide-react';

const DiscussionsPage = () => {
  const navigate = useNavigate();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await api.get('/discussions');
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/discussions', newDiscussion);
      setIsModalOpen(false);
      setNewDiscussion({
        title: '',
        content: '',
        category: 'General'
      });
      fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await api.patch(`/discussions/${id}/like`);

      setDiscussions(discussions.map((d: any) =>
        d.id === id ? { ...d, likes: d.likes + 1 } : d
      ));
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Community Discussions
          </h1>
          <p className="text-gray-500 mt-1">
            Share ideas, ask questions, and grow together.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-primary-100"
        >
          <Plus size={20} />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>General</option>
            <option>Career</option>
            <option>Technical</option>
            <option>Showcase</option>
          </select>

          <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-50 rounded w-2/3"></div>
            </div>
          ))
        ) : discussions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-gray-500">
            No discussions yet. Create the first one!
          </div>
        ) : (
          discussions.map((discussion: any) => (
            <div
              key={discussion.id}
              onClick={() => navigate(`/discussions/${discussion.id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {discussion.category}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(discussion.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition mb-2">
                {discussion.title}
              </h3>

              <p className="text-gray-600 line-clamp-2 mb-6">
                {discussion.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">
                    {discussion.author?.name?.[0]?.toUpperCase() || 'U'}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {discussion.author?.name || 'Unknown User'}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(discussion.id);
                    }}
                    className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition"
                  >
                    <ThumbsUp size={18} />
                    <span className="text-sm font-bold">
                      {discussion.likes || 0}
                    </span>
                  </button>

                  <div className="flex items-center space-x-2 text-gray-500">
                    <MessageCircle size={18} />
                    <span className="text-sm font-bold">
                      {discussion._count?.comments || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Discussion
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Title
                </label>

                <input
                  required
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value
                    })
                  }
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Category
                </label>

                <select
                  value={newDiscussion.category}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      category: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                >
                  <option>General</option>
                  <option>Career</option>
                  <option>Technical</option>
                  <option>Showcase</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Content
                </label>

                <textarea
                  required
                  rows={6}
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value
                    })
                  }
                  placeholder="Describe your discussion topic in detail..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow-lg shadow-primary-100"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionsPage;
