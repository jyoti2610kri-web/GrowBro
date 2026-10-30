
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Users,
    MessageSquare,
    Rocket,
    Sparkles,
    Lock,
    CheckCircle
} from 'lucide-react';

const previewData: any = {
    'ai-assistant': {
        title: 'AI Study Assistant',
        subtitle: 'Learn smarter with your personal AI study companion.',
        icon: BookOpen,
        examples: [
            {
                question: 'What is a data structure?',
                answer: 'A data structure is a way of organizing and storing data so that it can be accessed and used efficiently.'
            },
            {
                question: 'What is the difference between an array and a linked list?',
                answer: 'An array stores elements in continuous memory locations, while a linked list stores elements in separate nodes connected through links.'
            }
        ]
    },

    discussions: {
        title: 'Discussion Hub',
        subtitle: 'Learn together, share ideas and connect with students.',
        icon: Users,
        examples: [
            {
                title: 'How should I start learning DSA?',
                category: 'Technical',
                author: 'Rahul',
                replies: 12
            },
            {
                title: 'Java vs Python for beginners?',
                category: 'General',
                author: 'Ananya',
                replies: 8
            },
            {
                title: 'Share your latest coding project!',
                category: 'Showcase',
                author: 'Priya',
                replies: 15
            }
        ]
    },

    practice: {
        title: 'Practice Mode',
        subtitle: 'Practice questions and improve your problem-solving skills.',
        icon: MessageSquare,
        question: 'Which data structure follows the LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        answer: 'Stack',
        feedback: 'Correct! A Stack follows Last In, First Out (LIFO). The last element added is the first one removed.'
    },

    missions: {
        title: 'Real-World Missions',
        subtitle: 'Grow beyond academics through meaningful activities.',
        icon: Rocket,
        examples: [
            {
                title: 'Plant a Tree',
                description: 'Contribute to a greener environment by planting a tree.',
                points: 50
            },
            {
                title: 'Help a Fellow Student',
                description: 'Share your knowledge and help someone understand a topic.',
                points: 30
            },
            {
                title: 'Complete a Coding Challenge',
                description: 'Solve a programming problem and improve your skills.',
                points: 40
            }
        ]
    }
};

const FeaturePreviewPage = () => {
    const { feature } = useParams();
    const data = previewData[feature || ''];
    const Icon = data?.icon;

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Preview not found</h1>
                <Link to="/" className="text-primary-600 hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <nav className="bg-white border-b px-6 py-5">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                        GrowBro
                    </Link>

                    <Link to="/login" className="text-primary-600 font-semibold">
                        Login
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-2xl bg-primary-100 text-primary-600 mb-5">
                        <Icon size={36} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        {data.title}
                    </h1>

                    <p className="text-gray-500 text-lg">
                        {data.subtitle}
                    </p>

                    <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-4 py-2 rounded-full">
                        Preview Mode
                    </span>
                </div>

                {/* AI Assistant Preview */}
                {feature === 'ai-assistant' && (
                    <div className="space-y-6">
                        {data.examples.map((item: any, index: number) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-primary-600 font-bold mb-4">
                                    <Sparkles size={18} />
                                    Sample Question
                                </div>

                                <p className="font-semibold text-lg mb-5">
                                    {item.question}
                                </p>

                                <div className="bg-primary-50 p-5 rounded-xl">
                                    <p className="text-sm font-bold text-primary-700 mb-2">
                                        AI Assistant
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Discussion Preview */}
                {feature === 'discussions' && (
                    <div className="space-y-4">
                        {data.examples.map((item: any, index: number) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                    {item.category}
                                </span>

                                <h3 className="text-xl font-bold mt-4 mb-3">
                                    {item.title}
                                </h3>

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Posted by {item.author}</span>
                                    <span className="flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        {item.replies} replies
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Practice Preview */}
                {feature === 'practice' && (
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-primary-600 uppercase">
                            Sample Question
                        </span>

                        <h2 className="text-xl font-bold mt-4 mb-6">
                            {data.question}
                        </h2>

                        <div className="space-y-3">
                            {data.options.map((option: string) => (
                                <div
                                    key={option}
                                    className={`p-4 rounded-xl border ${option === data.answer
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{option}</span>
                                        {option === data.answer && (
                                            <CheckCircle className="text-green-600" size={20} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-5 bg-green-50 rounded-xl">
                            <p className="font-bold text-green-700 mb-2">
                                Sample AI Feedback
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {data.feedback}
                            </p>
                        </div>
                    </div>
                )}

                {/* Missions Preview */}
                {feature === 'missions' && (
                    <div className="space-y-4">
                        {data.examples.map((item: any, index: number) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <span className="text-primary-600 font-bold">
                                        {item.points} points
                                    </span>
                                </div>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Login prompt */}
                <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-center text-white">
                    <Lock size={30} className="mx-auto mb-4" />

                    <h2 className="text-2xl font-bold mb-3">
                        Ready to try GrowBro?
                    </h2>

                    <p className="text-primary-100 mb-6">
                        Create an account to access the complete feature and start your growth journey.
                    </p>

                    <Link
                        to="/login"
                        className="inline-block bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
                    >
                        Login to Continue
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default FeaturePreviewPage;
