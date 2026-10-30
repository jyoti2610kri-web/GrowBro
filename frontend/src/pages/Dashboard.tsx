

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MessageSquare,
  Trophy,
  BookOpen,
  ArrowUpRight,
  Target
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-90`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="flex items-center text-green-500 text-sm font-medium">
          {trend} <ArrowUpRight size={16} className="ml-1" />
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [missionsDone, setMissionsDone] = useState(0);
  const [communityPoints, setCommunityPoints] = useState(0);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [recentDiscussions, setRecentDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [missionResponse, discussionResponse] = await Promise.all([
          api.get('/missions'),
          api.get('/discussions')
        ]);

        const missions = missionResponse.data;
        const discussions = discussionResponse.data;

        const completedMissions = missions.filter(
          (mission: any) => mission.completions?.length > 0
        );

        const totalPoints = completedMissions.reduce(
          (total: number, mission: any) =>
            total + (Number(mission.points) || 0),
          0
        );

        setMissionsDone(completedMissions.length);
        setCommunityPoints(totalPoints);
        setDiscussionCount(discussions.length);

        setRecentDiscussions(
          [...discussions]
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 3)
        );

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Community Points',
      value: loading ? '...' : communityPoints.toLocaleString(),
      icon: Trophy,
      color: 'bg-yellow-500',
      trend: null
    },
    {
      title: 'Discussions',
      value: loading ? '...' : discussionCount,
      icon: MessageSquare,
      color: 'bg-blue-500',
      trend: null
    },
    {
      title: 'Missions Done',
      value: loading ? '...' : missionsDone,
      icon: Target,
      color: 'bg-purple-500',
      trend: null
    },
    {
      title: 'Active Courses',
      value: '3',
      icon: BookOpen,
      color: 'bg-green-500',
      trend: null
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your growth today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Activity
            </h2>
            <button
              onClick={() => navigate('/discussions')}
              className="text-primary-600 text-sm font-semibold hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-sm text-gray-500">Loading activity...</p>
            ) : recentDiscussions.length === 0 ? (
              <p className="text-sm text-gray-500">
                No recent activity yet. Start a discussion!
              </p>
            ) : (
              recentDiscussions.map((discussion: any) => (
                <div
                  key={discussion.id}
                  onClick={() => navigate(`/discussions/${discussion.id}`)}
                  className="flex items-start space-x-4 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={18} className="text-gray-500" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New discussion: {' '}
                      <span className="text-primary-600 group-hover:underline">
                        "{discussion.title}"
                      </span>
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Up Next / Suggestions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Current Mission
          </h2>

          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary-600 rounded-lg text-white">
                <Target size={20} />
              </div>
              <h3 className="font-bold text-primary-900">
                Daily Streak
              </h3>
            </div>

            <p className="text-sm text-primary-700 mb-4">
              Complete one practice session today to keep your streak alive!
            </p>

            <div className="w-full bg-primary-200 rounded-full h-2 mb-2">
              <div className="bg-primary-600 h-2 rounded-full w-3/4"></div>
            </div>

            <p className="text-xs text-primary-600 font-medium">
              75% completed
            </p>
          </div>

          <button
            onClick={() => navigate('/missions')}
            className="w-full mt-6 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow-lg shadow-primary-200"
          >
            Continue Learning
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
