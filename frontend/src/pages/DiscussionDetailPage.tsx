
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Loader2 } from 'lucide-react';
import api from '../services/api';

const DiscussionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [discussion, setDiscussion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchDiscussion = async () => {
        try {
            const response = await api.get(`/discussions/${id}`);
            setDiscussion(response.data);
        } catch (error) {
            console.error('Error fetching discussion:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) return;

        try {
            setSubmitting(true);

            await api.post('/discussions/comments', {
                discussionId: id,
                content: comment.trim(),
            });

            setComment('');
            await fetchDiscussion();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Unable to add comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-gray-600 mb-4">Discussion not found.</p>
                <button
                    onClick={() => navigate('/discussions')}
                    className="text-primary-600 font-bold hover:underline"
                >
                    Back to Discussions
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/discussions')}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium"
            >
                <ArrowLeft size={18} />
                Back to Discussions
            </button>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full uppercase">
                        {discussion.category}
                    </span>

                    <span className="text-xs text-gray-400">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {discussion.title}
                </h1>

                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {discussion.content}
                </p>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center font-bold text-primary-600">
                        {discussion.author?.name?.[0]?.toUpperCase() || 'U'}
                    </div>

                    <div>
                        <p className="font-bold text-gray-800">
                            {discussion.author?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-400">Discussion Author</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <MessageCircle size={21} />
                    Comments ({discussion.comments?.length || 0})
                </h2>

                <form onSubmit={handleAddComment} className="mb-8">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment..."
                        rows={3}
                        className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />

                    <div className="flex justify-end mt-3">
                        <button
                            type="submit"
                            disabled={submitting || !comment.trim()}
                            className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold transition"
                        >
                            {submitting ? (
                                <Loader2 size={17} className="animate-spin" />
                            ) : (
                                <Send size={17} />
                            )}
                            Post Comment
                        </button>
                    </div>
                </form>

                <div className="space-y-5">
                    {discussion.comments?.length > 0 ? (
                        discussion.comments.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex gap-3 border-t border-gray-100 pt-5"
                            >
                                <div className="w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                    {item.author?.name?.[0]?.toUpperCase() || 'U'}
                                </div>

                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-sm">
                                        {item.author?.name || 'Unknown User'}
                                    </p>

                                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                                        {item.content}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-5">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionDetailPage;
