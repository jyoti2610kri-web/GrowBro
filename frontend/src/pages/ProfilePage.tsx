
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Shield,
  MessageSquare,
  Trophy,
  Loader2,
  Camera,
  X
} from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setName(response.data.name || '');
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = () => {
    setName(profile?.name || '');
    setBio(profile?.bio || '');
    setError('');
    setSuccess('');
    setEditOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/profile', {
        name: name.trim(),
        bio
      });

      setProfile((prev: any) => ({
        ...prev,
        ...response.data.user
      }));

      setEditOpen(false);
      setSuccess('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message ||
        'Unable to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-500">
        Unable to load your profile. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {success}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-xl">
              <div className="w-full h-full bg-primary-100 rounded-2xl flex items-center justify-center text-4xl font-black text-primary-600 border-4 border-white">
                {profile.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>

            <div className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-600">
              <Camera size={20} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {profile.name}
              </h1>

              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={16} /> {profile.email}
              </p>
            </div>

            <button
              onClick={openEditForm}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              About Me
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              {profile.bio || 'No bio added yet. Tell the community about yourself!'}
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Calendar size={18} />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Shield size={18} />
                Verified Member
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-3 gap-4">

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
              <MessageSquare className="mx-auto mb-2 text-blue-500" size={24} />
              <p className="text-2xl font-black text-gray-900">
                {profile._count?.discussions || 0}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase">Posts</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
              <Trophy className="mx-auto mb-2 text-yellow-500" size={24} />
              <p className="text-2xl font-black text-gray-900">
                {profile._count?.missions || 0}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase">Missions</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
              <Shield className="mx-auto mb-2 text-green-500" size={24} />
              <p className="text-2xl font-black text-gray-900">Level 4</p>
              <p className="text-xs font-bold text-gray-500 uppercase">Rank</p>
            </div>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Recent Activity
            </h2>

            <div className="space-y-8">
              {profile._count?.discussions === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity to show.
                </p>
              ) : (
                <div className="flex items-center justify-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm font-medium text-gray-500">
                    Activity feed coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Write something about yourself..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
