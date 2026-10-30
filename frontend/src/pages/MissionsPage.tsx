
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Trophy,
  CheckCircle2,
  Circle,
  Star,
  Target,
  ArrowRight,
  Loader2
} from 'lucide-react';

const MissionsPage = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await api.get('/missions');
      setMissions(response.data);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMission = async (
    missionId: string,
    isCompleted: boolean
  ) => {
    try {
      if (isCompleted) {
        await api.delete(`/missions/complete/${missionId}`);
      } else {
        await api.post('/missions/complete', {
          missionId,
          update: 'Completed via web'
        });
      }

      await fetchMissions();
    } catch (error) {
      console.error('Error updating mission:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Your Missions <Target className="text-red-500" />
          </h1>
          <p className="text-gray-500 mt-1">
            Complete challenges, earn points, and level up your career.
          </p>
        </div>

        <div className="bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-100 flex items-center gap-3 shadow-sm">
          <Trophy className="text-yellow-600" size={24} />
          <div>
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
              Total Points
            </p>
            <p className="text-xl font-black text-yellow-900">1,250</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Available Challenges
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-gray-100">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : missions.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
              <p className="text-gray-500">
                No missions available at the moment. Check back later!
              </p>
            </div>
          ) : (
            missions.map((mission: any) => {
              const isCompleted = mission.completions?.length > 0;

              return (
                <div
                  key={mission.id}
                  className={`bg-white p-6 rounded-2xl border transition group ${isCompleted
                      ? 'border-green-100 bg-green-50/20'
                      : 'border-gray-100 hover:shadow-lg hover:border-primary-100'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`p-2 rounded-lg ${isCompleted
                              ? 'bg-green-100 text-green-600'
                              : 'bg-primary-50 text-primary-600'
                            }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <Circle size={18} />
                          )}
                        </span>

                        <h3
                          className={`font-bold text-lg ${isCompleted
                              ? 'text-green-900 line-through'
                              : 'text-gray-900'
                            }`}
                        >
                          {mission.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {mission.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                          <Star size={14} fill="currentColor" />
                          {mission.points} Points
                        </span>

                        <button
                          onClick={() =>
                            handleToggleMission(mission.id, isCompleted)
                          }
                          className={`flex items-center gap-1.5 text-xs font-bold hover:underline ${isCompleted
                              ? 'text-red-600'
                              : 'text-primary-600'
                            }`}
                        >
                          {isCompleted
                            ? 'Mark as Incomplete'
                            : 'Mark as Complete'}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Progress</h2>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-600">Daily Goal</span>
                  <span className="text-primary-600">3/5</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-primary-600 h-3 rounded-full w-[60%] shadow-sm"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-600">Level 4</span>
                  <span className="text-yellow-600">750 XP to Level 5</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full w-[40%] shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                Milestones
              </h4>

              <div className="space-y-3">
                {[
                  { name: 'Early Bird', done: true },
                  { name: 'Code Ninja', done: true },
                  { name: 'Community Pillar', done: false },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${m.done ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${m.done ? 'text-gray-900' : 'text-gray-400'
                        }`}
                    >
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
